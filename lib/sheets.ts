import { google } from "googleapis";

/**
 * Запись заявок в Google Sheets через Service Account.
 * Ключи только на сервере (env), никогда не уходят на клиент.
 *
 * Требуется расшарить таблицу на email сервис-аккаунта (право «Редактор»).
 */

export type SheetRow = {
  timestamp: string;
  name: string;
  phone: string;
  color: string;
  size: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  ttclid: string;
  referrer: string;
};

function getEnv() {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const range = process.env.GOOGLE_SHEET_RANGE || "Заявки!A:K";

  if (!email || !rawKey || !sheetId) {
    throw new Error(
      "Google Sheets не настроен: проверь GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID в .env",
    );
  }

  // Приватный ключ в env хранится с экранированными \n — восстанавливаем переносы.
  const privateKey = rawKey.replace(/\\n/g, "\n");

  return { email, privateKey, sheetId, range };
}

function getSheetsClient() {
  const { email, privateKey } = getEnv();
  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

const HEADER = [
  "Дата/время",
  "Имя",
  "Телефон",
  "Цвет",
  "Размер",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "ttclid",
  "referrer",
];

type Sheets = ReturnType<typeof getSheetsClient>;

/** Извлекает имя листа из диапазона: `Заявки!A:K` → `Заявки`, `'Мой лист'!A:K` → `Мой лист`. */
function sheetTitleFromRange(range: string): string {
  const bang = range.lastIndexOf("!");
  const title = bang === -1 ? range : range.slice(0, bang);
  if (title.startsWith("'") && title.endsWith("'")) {
    return title.slice(1, -1).replace(/''/g, "'");
  }
  return title;
}

/**
 * Гарантирует, что лист с нужным названием существует. Если нет — создаёт его
 * и записывает строку заголовков. Это устраняет ошибку «Unable to parse range»
 * и гонку, когда заявки уходили не в тот лист.
 */
async function ensureSheet(sheets: Sheets, spreadsheetId: string, title: string): Promise<void> {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });
  const exists = meta.data.sheets?.some((s) => s.properties?.title === title);
  if (exists) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: [{ addSheet: { properties: { title } } }] },
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${title}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [HEADER] },
  });
}

export async function appendLead(row: SheetRow): Promise<void> {
  const { sheetId, range } = getEnv();
  const sheets = getSheetsClient();

  await ensureSheet(sheets, sheetId, sheetTitleFromRange(range));

  const values = [
    [
      row.timestamp,
      row.name,
      row.phone,
      row.color,
      row.size,
      row.utm_source,
      row.utm_medium,
      row.utm_campaign,
      row.utm_content,
      row.ttclid,
      row.referrer,
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
}

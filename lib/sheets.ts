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

export async function appendLead(row: SheetRow): Promise<void> {
  const { sheetId, range } = getEnv();
  const sheets = getSheetsClient();

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

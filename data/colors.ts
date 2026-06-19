/**
 * 4 цвета товара. Замени `hex` и `image` на реальные значения/фото.
 * `id` используется в форме и при записи в Google Sheets — менять осторожно.
 * `image` — путь к фото в /public (сейчас плейсхолдеры рисуются компонентом).
 */
export type ProductColor = {
  id: string;
  name: string;
  hex: string;
  image: string; // например "/products/black.jpg"
};

export const colors: ProductColor[] = [
  { id: "black", name: "Чёрный", hex: "#1A1A1F", image: "/products/black.jpg" },
  { id: "gray", name: "Серый", hex: "#8A8F98", image: "/products/gray.jpg" },
  { id: "navy", name: "Тёмно-синий", hex: "#1E2A4A", image: "/products/navy.jpg" },
  { id: "khaki", name: "Хаки", hex: "#6B6A47", image: "/products/khaki.jpg" },
];

export const colorIds = colors.map((c) => c.id);

export function getColor(id: string | null | undefined): ProductColor | undefined {
  return colors.find((c) => c.id === id);
}

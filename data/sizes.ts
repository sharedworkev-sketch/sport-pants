/**
 * Размерная сетка. Универсальная посадка — «на любую фигуру».
 * Значения `id` пишутся в Google Sheets.
 */
export type ProductSize = {
  id: string;
  label: string; // что видит покупатель
};

export const sizes: ProductSize[] = [
  { id: "S", label: "S (42–44)" },
  { id: "M", label: "M (46–48)" },
  { id: "L", label: "L (50–52)" },
  { id: "XL", label: "XL (54–56)" },
  { id: "XXL", label: "XXL (58–60)" },
];

export const sizeIds = sizes.map((s) => s.id);

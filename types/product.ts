export type Product = {
  id: string;
  title: string;
  description: string; // 👈 NEW
  price: number;
  previewUrl: string;
  filePath: string;
  category: string; // 🔥 NEW
  subCategory?: string; // optional
  tags?: string[]; // optional (SEO & filtering)
  isFeatured?: boolean; // optional
};

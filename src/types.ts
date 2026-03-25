export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  thickness: string[];
  lengths: string[];
  isBestSeller?: boolean;
  outOfStock?: boolean;
  nameVariants?: Array<{ label: string; image?: string }>;
  rating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedThickness?: string;
  selectedLength?: string;
}

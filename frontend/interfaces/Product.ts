export interface HomeProduct {
  coverImage: string;
  hoverImage: string;
  price: number;
  rating: number;
  slug: string;
  title: string;
  volume: number;
  reviewCount: number;
}

export interface ProductDetails {
  _id: string;
  price: number;
  rating: number;
  slug: string;
  title: string;
  volume: number;
  images: string[];
  reviews: Review[];
  body: any;
  stock: number;
  isAddedToCart: boolean;
}

export interface Review {
  firstName: string;
  lastName: string;
  rating: number;
  comment: string;
}

export interface SearchResultProduct {
  title: string;
  slug: string;
  coverImage: string;
}

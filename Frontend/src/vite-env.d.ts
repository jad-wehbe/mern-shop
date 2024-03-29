/// <reference types="vite/client" />

interface IReview {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IProduct {
  _id: string;
  user: string;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
  qty?: number;
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

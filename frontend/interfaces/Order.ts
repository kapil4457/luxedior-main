export interface Order {
  _id?: string;
  _createdAt?: Date;
  orderStatus: string;
  paymentStatus: string;
  transactionId: string;
  shippingAddress: ShippingAddress;
  products: OrderProduct[];
  emailId?: string;
}

export interface ShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}
export interface OrderProduct {
  _id: string;
  quantity: number;
  coverImage?: string | any;
  title?: string;
  price?: number;
  slug?: string | any;
  volume?: number;
  product?: OrderProduct;
}

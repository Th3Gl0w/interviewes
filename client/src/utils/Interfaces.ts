export interface User {
    id: number;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface AllOrder {
    id?: number;
    price?: number;
    expirationDate?: string;
    userId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    user?: User;
  }
  export interface Order {
    price: number;
  }
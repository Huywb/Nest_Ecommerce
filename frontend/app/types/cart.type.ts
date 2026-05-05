import { Product } from "./product.type";


export interface CartItemType {
    product: Product,
    quantity: number,
    price: number
}
export interface Cart {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

export interface CartItem {
    id: string;
    cartId: string,
    productId: string,
    price: number;
    quantity: number;
    product: Product,
    createAt: string;
    updateAt: string;
}
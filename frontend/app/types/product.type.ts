import { Category } from "./category.type";

export interface Product {
    id:string,
    name: string,
    description?: string,
    price: number,
    stock:number,
    sku: string,
    imageUrl?: string,
    category: Category
}
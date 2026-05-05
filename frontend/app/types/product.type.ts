import { Category } from "./category.type";

export interface Product {
    id:string,
    name: string,
    description?: string,
    price: number,
    stock:number,
    sku: string,
    imageUrl?: string,
    category: string
    categoryId: string,
    quantity: number
}

export interface ProductQueryParams {
    page?: number,
    limit?: number,
    search?: string,
    category?: string
}

export interface PaginationMeta {
    total: number,
    page: number,
    limit: number,
    totalPages: number
}

export interface ProductResponse {
    data: Product[],
    meta?: PaginationMeta
}

export interface OrderItem {
    productId: string,
    quantity: number
}

export interface CreateOrderRequest {
    items: OrderItem[],
    shippingAddress: string
}

export interface Order {
    id: string,
    userId: string,
    cartItems: OrderItem[],
    shippingAddress: string,
    totalAmount: number,
    status: string,
    createdAt: string,
    updatedAt: string
}
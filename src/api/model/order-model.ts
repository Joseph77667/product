export interface OrderItemResponse {
  productName: string;
  quantity: number;
  productPrice: number;
}

export interface OrderResponse {
  id: number;
  orderId: number;
  customerName: string;
  customerPhone: string;
  address: string;
  totalPrice: number;
  orderItems: OrderItemResponse[];
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}


export interface OrderRequest {
  customerName: string;
  customerPhone: string;
  address: string;
  orderItems: OrderItemRequest[];
}

export interface ProductRequest {
    code: string;
    name: string;
    description: string;
    image: File;
    price: number;
    quantity: number;
}

export interface ProductResponse {
    totalQuantity: any;
    id: number;
    code: string;
    name: string;
    description: string;
    filePath: string;
    imageName: string;
    price: number;
    quantity: number;
}

export interface PaginationResponse {
    items: ProductResponse[];
    totalCount: number;
    totalPages: number;
}

export interface PaginationResponse {
    items: ProductResponse[];
    totalCount: number;
    totalPages: number;
}
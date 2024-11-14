export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category?: string;
    createdAt: Date;
}

export interface Bill {
    id: number;
    date: Date;
    customerName: string;
    items: BillItem[];
    total: number;
    status: 'pending' | 'paid' | 'cancelled';
}

export interface BillItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

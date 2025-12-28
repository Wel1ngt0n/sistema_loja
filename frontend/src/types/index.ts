export interface Category {
    id: number;
    name: string;
    sort_order: number;
    active: boolean;
}

export interface CashierSession {
    id: number;
    user_name: string;
    opened_at: string;
    closed_at?: string;
    start_balance: number;
    current_balance: number;
    status: 'OPEN' | 'CLOSED';
}

export interface Payment {
    id: number;
    amount: number;
    method: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';
    created_at: string;
}

export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';

export interface KitOptionItem {
    name: string;
    price_mod?: number; // Optional extra cost
}

export interface KitOptionGroup {
    title: string;
    min: number;
    max: number;
    items: string[]; // For simplicity now, just strings. Or make it objects later.
}

export interface Product {
    id: number;
    name: string;
    barcode?: string;
    category_id: number;
    category_name?: string;
    unit: 'UN' | 'KG' | 'G' | 'PORCAO';
    price: number;
    active: boolean;
    controls_stock: boolean;
    stock_qty: number;
    available_in_totem: boolean;
    image_url?: string;
    description?: string;

    // Kit
    is_kit?: boolean;
    kit_options?: KitOptionGroup[];
    featured?: boolean;
    upsell?: boolean;
}

// ... (previous content)
export interface User {
    id: number;
    name: string;
    username: string;
    role: 'ADMIN' | 'CASHIER' | 'KITCHEN';
    active: boolean;
}

export interface OrderItem {
    id: number;
    product_id: number;
    product_name?: string; // Optional, backend might send it joined
    qty: number;
    unit_price: number;
    notes?: string;
}

export interface Order {
    id: number;
    order_number: string;
    origin: 'TOTEM' | 'PDV';
    status: 'PENDING' | 'PREPARING' | 'READY' | 'PAID' | 'CANCELED';
    created_at: string;
    items: OrderItem[];
    total?: number; // Optional locally calculated
}

export interface Customer {
    id: number;
    name: string;
    cpf?: string;
    phone?: string;
    email?: string;
}

export interface SaleItem {
    id?: number; // Optional on creation
    product_id: number;
    product_name: string;
    qty: number;
    unit_price: number;
    total_price: number;
    notes?: string;
}

export interface Sale {
    id: number;
    order_id?: number;
    cashier_user_id: number;
    subtotal: number;
    discount_type: 'NONE' | 'FIXED' | 'PERCENT';
    discount_value: number;
    total: number;
    status: 'COMPLETED' | 'CANCELED';
    created_at: string;
    items: SaleItem[];
    customer?: Customer;
    user_name: string;
    payments: Payment[];
    total_value?: number; // Alias or compatibility
}

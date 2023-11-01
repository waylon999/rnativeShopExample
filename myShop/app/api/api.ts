
const API_URL = process.env.EXPO_PUBLIC_API_URL;


export interface Product {
    id: number;
    product_name: string;
    product_category: string;
    product_price: number;
    product_image: string;
    product_description: string;
    product_stock: number;
}

interface CreateOrder {
    email: string;
    products: Array<{ product_id: number, quantity: number }>;
}

export interface Order {
    id: number;
    order_date: Date;
    customer_email: string;
    total: number;
}

export async function fetchProducts(): Promise<Product[]> {
    try {
        console.log(`${API_URL}/products`);
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}


export async function fetchProduct(id: number): Promise<Product> {
    try {
        console.log(`${API_URL}/products`);
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}
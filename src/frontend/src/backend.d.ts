import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    userId: Principal;
    name: string;
    createdAt: Time;
    savedAddresses: Array<Address>;
    email: string;
    phone: string;
}
export interface ProductInput {
    name: string;
    description: string;
    howToUse: string;
    stock: bigint;
    imageUrl: string;
    isFeatured: boolean;
    category: ProductCategory;
    benefits: string;
    safetyInfo: string;
    price: bigint;
    ingredients: string;
}
export type CafResult_1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type Time = bigint;
export interface Address {
    city: string;
    line1: string;
    line2: string;
    state: string;
    pincode: string;
}
export interface Order {
    paymentMethod: PaymentMethod;
    orderStatus: OrderStatus;
    userId: Principal;
    createdAt: Time;
    orderId: string;
    updatedAt: Time;
    totalAmount: bigint;
    customerDetails: CustomerDetails;
    shippingAddress: Address;
    items: Array<ProductWithQuantity>;
}
export type CafResult = {
    __kind__: "ok";
    ok: Product;
} | {
    __kind__: "err";
    err: string;
};
export interface ProductWithQuantity {
    quantity: bigint;
    price: bigint;
    product: Product;
}
export interface Product {
    id: string;
    featured: boolean;
    inStock: boolean;
    name: string;
    howToUse: string;
    imageUrl: string;
    shortDescription: string;
    category: ProductCategory;
    benefits: Array<string>;
    safetyInfo: string;
    fullDescription: string;
    price: bigint;
    ingredients: Array<string>;
}
export interface CustomerDetails {
    name: string;
    email: string;
    phone: string;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum PaymentMethod {
    cod = "cod",
    upi = "upi",
    netbanking = "netbanking",
    card = "card"
}
export enum ProductCategory {
    ayurvedicCare = "ayurvedicCare",
    immunity = "immunity",
    digestiveHealth = "digestiveHealth",
    fitness = "fitness",
    multivitamins = "multivitamins",
    herbalSupplements = "herbalSupplements"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addSavedAddress(address: Address): Promise<void>;
    addToCart(productId: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createOrUpdateProfile(name: string, email: string, phone: string): Promise<void>;
    createOrder(customerDetails: CustomerDetails, shippingAddress: Address, paymentMethod: PaymentMethod): Promise<string>;
    createProduct(input: ProductInput): Promise<CafResult>;
    deleteProduct(id: string): Promise<CafResult_1>;
    deleteSavedAddress(index: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<{
        items: Array<ProductWithQuantity>;
        subtotal: bigint;
    }>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getOrderById(orderId: string): Promise<Order>;
    getProduct(id: string): Promise<Product>;
    getUserOrders(): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    listAllProductsAdmin(): Promise<Array<Product>>;
    listProducts(category: ProductCategory | null): Promise<Array<Product>>;
    removeFromCart(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setFeatured(id: string, featured: boolean): Promise<CafResult_1>;
    updateCartItemQuantity(productId: string, quantity: bigint): Promise<void>;
    updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void>;
    updateProduct(id: string, input: ProductInput): Promise<CafResult>;
    updateProductStock(productId: string, inStock: boolean): Promise<void>;
    updateSavedAddress(index: bigint, address: Address): Promise<void>;
}

import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CustomerDetails {
    name: string;
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
export interface ReturnRequest {
    status: Variant_pending_approved_rejected;
    requestId: string;
    requestType: Variant_replace_returnItem;
    requestedAt: Time;
    reason: ReturnReason;
}
export interface Order {
    paymentMethod: PaymentMethod;
    deliveredAt?: Time;
    orderStatus: OrderStatus;
    userId: Principal;
    createdAt: Time;
    orderId: string;
    updatedAt: Time;
    totalAmount: bigint;
    customerDetails: CustomerDetails;
    shippingAddress: Address;
    returnRequests: Array<ReturnRequest>;
    cancelReason?: string;
    items: Array<ProductWithQuantity>;
}
export type CafResult = {
    __kind__: "ok";
    ok: Product;
} | {
    __kind__: "err";
    err: string;
};
export type CafResult_2 = {
    __kind__: "ok";
    ok: string;
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
export interface UserProfile {
    userId: Principal;
    name: string;
    createdAt: Time;
    savedAddresses: Array<Address>;
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
export enum ReturnReason {
    DamagedInShipment = "DamagedInShipment",
    WrongProduct = "WrongProduct",
    Defective = "Defective"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_approved_rejected {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum Variant_replace_returnItem {
    replace = "replace",
    returnItem = "returnItem"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addSavedAddress(address: Address): Promise<void>;
    addToCart(productId: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    canCancelOrder(orderId: string): Promise<boolean>;
    canReturnOrder(orderId: string): Promise<boolean>;
    cancelOrder(orderId: string, reason: string | null): Promise<CafResult_1>;
    clearCart(): Promise<void>;
    createOrUpdateProfile(name: string, email: string, phone: string): Promise<void>;
    createOrder(customerDetails: CustomerDetails, shippingAddress: Address, paymentMethod: PaymentMethod): Promise<string>;
    createProduct(input: ProductInput): Promise<CafResult>;
    deleteProduct(id: string): Promise<CafResult_1>;
    deleteSavedAddress(index: bigint): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAnalyticsSummary(): Promise<{
        totalProducts: bigint;
        totalOrders: bigint;
        totalRevenue: bigint;
        avgOrderValue: bigint;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<{
        items: Array<ProductWithQuantity>;
        subtotal: bigint;
    }>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getOrderById(orderId: string): Promise<Order>;
    getOrdersByDay(days: bigint): Promise<Array<[string, bigint]>>;
    getOrdersByStatus(): Promise<Array<[string, bigint]>>;
    getPaymentMethodBreakdown(): Promise<Array<[string, bigint]>>;
    getProduct(id: string): Promise<Product>;
    getRevenueByDay(days: bigint): Promise<Array<[string, bigint]>>;
    getTopSellingProducts(limit: bigint): Promise<Array<[string, string, bigint]>>;
    getUserOrders(): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    listAllProductsAdmin(): Promise<Array<Product>>;
    listProducts(category: ProductCategory | null): Promise<Array<Product>>;
    removeFromCart(productId: string): Promise<void>;
    requestReplace(orderId: string, reason: ReturnReason): Promise<CafResult_2>;
    requestReturn(orderId: string, reason: ReturnReason): Promise<CafResult_2>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setFeatured(id: string, featured: boolean): Promise<CafResult_1>;
    updateCartItemQuantity(productId: string, quantity: bigint): Promise<void>;
    updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void>;
    updateProduct(id: string, input: ProductInput): Promise<CafResult>;
    updateProductStock(productId: string, inStock: boolean): Promise<void>;
    updateSavedAddress(index: bigint, address: Address): Promise<void>;
}

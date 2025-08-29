export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IValidationResult {
    [key: string]: string;
}

export interface IProduct {
    id: string; 
    description: string; 
    image: string; 
    title: string; 
    category: string; 
    price: number | null; 
}

export interface IBuyer {
    payment: TPayment; 
    email: string; 
    phone: string; 
    address: string; 
}

export type TPayment = 'card' | 'cash' | 'other';

// Дополнительные типы для API
export interface IApiResponse {
    total: number;
    items: IProduct[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IOrderRequest {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

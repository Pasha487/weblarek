import { Api } from "../base/Api";
import { IProduct, IApi, ApiPostMethods, IOrderResult, IApiResponse, IOrderRequest } from "../../types";

export class WebLarekApi implements IApi {
    constructor(private api: Api) {}

    async getProductList(): Promise<IProduct[]> {
        try {
            const response = await this.api.get<IApiResponse>('/product');
            return response.items || [];
        } catch (error) {
            console.error('Failed to fetch products:', error);
            throw new Error('Не удалось загрузить товары с сервера');
        }
    }

    async submitOrder(orderData: IOrderRequest): Promise<IOrderResult> {
        try {
            return await this.api.post<IOrderResult>('/order', orderData);
        } catch (error) {
            console.error('Failed to submit order:', error);
            throw new Error('Не удалось оформить заказ');
        }
    }

    // Реализация интерфейса IApi
    get<T extends object>(uri: string): Promise<T> {
        return this.api.get<T>(uri);
    }

    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T> {
        return this.api.post<T>(uri, data, method);
    }
}
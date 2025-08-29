import { IProduct, IApi, IOrderResult, IApiResponse, IOrderRequest } from "../../types";

export class WebLarekApi {
    constructor(private api: IApi) {}

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
}
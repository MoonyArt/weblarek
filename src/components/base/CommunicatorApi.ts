import { IApi, PostOrder, OrderResponse, ProductsResponse } from '../../types/index.ts';

export class CommunicatorApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<ProductsResponse> {
        return this.api.get<ProductsResponse>('/product');
    }

    createOrder(order: PostOrder): Promise<OrderResponse> {
        return this.api.post<OrderResponse>('/order', order);
    }
}

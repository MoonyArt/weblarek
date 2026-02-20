import type { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

export class ProductsList {
    protected products: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents, products?: IProduct[], product?: IProduct) {
        this.products = products || [];
        this.selectedProduct = product || null;
    };

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('products:changed');
    };

    getProducts(): IProduct[] {
        return this.products;
    };

    setProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.events.emit('product:changed', product);
    };

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }

    getProduct(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id) || undefined;
    };
}

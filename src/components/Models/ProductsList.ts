import type { IProduct } from '../../types/index.ts';

export class ProductsList {
    protected products: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;

    constructor(products?: IProduct[], product?: IProduct) {
        this.products = products || [];
        this.selectedProduct = product || null;
    };

    setProducts(products: IProduct[]): void {
        this.products = products;
    };

    getProducts(): IProduct[] {
        return this.products;
    };

    setProduct(product: IProduct): void {
        this.selectedProduct = product;
    };

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }

    getProduct(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id) || undefined;
    };
}

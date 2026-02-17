import type { IProduct } from '../../types/index.ts';

export class Basket {
    protected selectedProducts: IProduct[] = [];

    constructor(selectedProducts?: IProduct[]) {
        this.selectedProducts = selectedProducts || [];
    };

    addProduct(product: IProduct): void {
        this.selectedProducts.push(product);
    }

    removeProduct(id: string): void {
        this.selectedProducts = this.selectedProducts.filter(product => product.id !== id);
    };

    getSelectedProducts(): IProduct[] {
        return this.selectedProducts;
    };

    getProductCounter(): number {
        return this.selectedProducts.length;
    };

    getTotalCost(): number {
        return this.selectedProducts.reduce((total, item) => total + (item.price || 0), 0);
    };

    checkProductAvailable(id: string): boolean {
        return this.selectedProducts.some(product => product.id === id)
    }

    clearBasket(): void {
        this.selectedProducts = [];
    };
}
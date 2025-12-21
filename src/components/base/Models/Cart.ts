import type { IProduct } from '../../../types/index.ts';

export class Cart {
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
        let sum: number = 0;
        this.selectedProducts.forEach(product => {
            if (product.price !== null) {
                sum += product.price
            }
        });
        return sum;
    };

    checkProductAvailable(id: string): boolean {
        return this.selectedProducts.some(product => product.id === id)
    }

    clearCart(): void {
        this.selectedProducts = [];
    };
}
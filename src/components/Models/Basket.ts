import type { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

export class Basket {
    protected selectedProducts: IProduct[] = [];

    constructor(protected events: IEvents, selectedProducts?: IProduct[]) {
        this.selectedProducts = selectedProducts || [];
    };

    addProduct(product: IProduct): void {
        if (this.checkProductAvailable(product.id)) {
            console.log('Ошибка: Товар уже в корзине');
            return;
        }

        this.selectedProducts.push(product);
        this.events.emit('basket:changed', {
            items: this.getSelectedProducts(),
            count: this.getProductCounter(),
            total: this.getTotalCost()
        });
    }

    removeProduct(id: string): void {
        this.selectedProducts = this.selectedProducts.filter(product => product.id !== id);
        this.events.emit('basket:changed', {
            count: this.getProductCounter(),
            total: this.getTotalCost()
        });
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
        this.events.emit('basket:cleared')
    };
}
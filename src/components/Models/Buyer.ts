import type { IBuyer, TBuyerErrors } from '../../types/index.ts';

export class Buyer {
    protected payment: 'card' | 'cash' | '' = '';
    protected address: string = '';
    protected email: string = '';
    protected phone: string = '';

    constructor(buyer?: Partial<IBuyer>) {
        if (buyer) {
            this.setDataOfBuyer(buyer);
        }
    }

    getDataOfBuyer(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone
        };
    }

    setDataOfBuyer(buyer: Partial<IBuyer>): void {
        if (buyer.payment !== undefined) this.payment = buyer.payment;
        if (buyer.address !== undefined) this.address = buyer.address.trim();
        if (buyer.email !== undefined) this.email = buyer.email.trim();
        if (buyer.phone !== undefined) this.phone = buyer.phone.trim();
    }

    removeFormData(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    validationDataOfBuyer(): { errors: TBuyerErrors } {
        const errors: TBuyerErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.address) {
            errors.address = 'Укажите адрес доставки';
        }

        if (!this.email) {
            errors.email = 'Укажите email';
        }

        if (!this.phone) {
            errors.phone = 'Укажите номер телефона';
        }

        return {
            errors
        }
    };
}
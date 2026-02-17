import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { IBuyer } from "../../../types";

export type TFormOrderData = Pick<IBuyer, 'payment' | 'address'>;

export class FormOrder extends Form<TFormOrderData> {
    protected cardButtonElement: HTMLButtonElement;
    protected cashButtonElement: HTMLButtonElement;
    protected addressInputElement: HTMLInputElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.cardButtonElement = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButtonElement = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInputElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.cardButtonElement.addEventListener('click', () => {
            this.events.emit('payment:by-card', { payment: 'card' });
        });

        this.cashButtonElement.addEventListener('click', () => {
            this.events.emit('payment:in-cash', { payment: 'cash' });
        });

        this.addressInputElement.addEventListener('input', () => {
            this.events.emit('order:address-change', {address: this.addressInputElement.value});
        });
    }

    set payment(value: 'card' | 'cash' | '') {
        this.cardButtonElement.classList.toggle('button_alt-active', value === 'card');
        this.cashButtonElement.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this.addressInputElement.value = value;
    }
}
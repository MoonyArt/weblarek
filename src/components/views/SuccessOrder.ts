import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface ISuccessOrderData {
    totalCost: number;
}

export class SuccessOrder extends Component<ISuccessOrderData> {
    protected totalCostInfoElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.totalCostInfoElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        })
    }

    set totalCost(value: number) {
        this.totalCostInfoElement.textContent = `Списано ${value} синапсов`;
    }
}
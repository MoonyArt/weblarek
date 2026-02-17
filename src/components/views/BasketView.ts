import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasketData {
    totalCost: number;
    basketList: HTMLElement[];
}

export class BasketView extends Component<IBasketData> {
    protected basketListElement: HTMLElement;
    protected totalCostElement: HTMLElement;
    protected orderButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.basketListElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalCostElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButtonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.orderButtonElement.addEventListener('click', () => {
            this.events.emit('order:open');
        })
    }

    set basketList(cards: HTMLElement[]) {
        this.basketListElement.replaceChildren(...cards);
    }

    set totalCost(value: number) {
        this.totalCostElement.textContent = `${value} синапсов`;
    }

    set buttonText(value: string) {
        this.orderButtonElement.textContent = value;
    }

    set buttonActive(isActive: boolean) {
        this.orderButtonElement.classList.toggle('basket__button_disabled', !isActive);
    }
}
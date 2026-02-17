import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";
import { Card } from "./Card";

type TCardBasketData = Pick<IProduct, 'image' | 'category' | 'description'>;

export class CardPreview extends Card<TCardBasketData> {
    protected indexElement: HTMLElement;
    protected deleteButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButtonElement.addEventListener('click', () => {
            this.events.emit('product:delete-from-basket');
        })
    }

    set index(value: number) {
        this.indexElement.textContent = `${value}`;
    }
}
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";
import { Card } from "./Card";

type TCardBasketData = Pick<IProduct, 'image' | 'category' | 'description'>;

interface ICardBasketActions {
  onDelete?: () => void;
}

export class CardBasket extends Card<TCardBasketData> {
    protected indexElement: HTMLElement;
    protected deleteButtonElement: HTMLButtonElement;

    constructor(container: HTMLElement,  actions?: ICardBasketActions) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onDelete) {
            this.deleteButtonElement.addEventListener('click', actions.onDelete);
        }
    }

    set index(value: number) {
        this.indexElement.textContent = `${value}`;
    }
}

import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";
import { Card } from "./Card";
import { categoryMap } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap;
type TCardPreviewData = Pick<IProduct, 'image' | 'category' | 'description'>;

export class CardPreview extends Card<TCardPreviewData> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected textElement: HTMLElement;
    protected buyButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buyButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.buyButtonElement.addEventListener('click', () => {
            this.events.emit('product:add-to-basket');
        })
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        for (const key in categoryMap) {
            const className = categoryMap[key as CategoryKey];
            this.categoryElement.classList.toggle(className, key === value);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }

    set description(text: string) {
        this.textElement.textContent = text;
    }

    set buttonText(value: string) {
        this.buyButtonElement.textContent = value;
    }

    set buttonActive(isActive: boolean) {
        this.buyButtonElement.disabled = !isActive;
    }
}
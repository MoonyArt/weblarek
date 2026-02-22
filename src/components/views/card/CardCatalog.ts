import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { Card } from "./Card";
import { categoryMap } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap;
export type TCardCatalogData = Pick<IProduct, 'image' | 'category'>

interface ICardCatalogActions {
  onClick?: () => void;
}

export class CardCatalog extends Card<TCardCatalogData> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardCatalogActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
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
}
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        // Закрытие модального окна при клике на оверлей
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    }

    set content(element: HTMLElement) {
        this.contentElement.replaceChildren(element);
    }

    open(): void {
        this.container.classList.add('.modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('.modal_active');
        this.contentElement.replaceChildren();
        this.events.emit('modal:close');
    }
}
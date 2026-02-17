import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface IFormData {
    errors: string;
}

export class Form<T> extends Component<IFormData & T> {
    protected errorElement: HTMLElement;
    protected submitButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.submitButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.getAttribute('name')}:submit`);
        });
    }

    set errors(value: string) {
        this.errorElement.textContent = value;
    }

    set buttonActive(isActive: boolean) {
        this.submitButtonElement.disabled = !isActive;
    }
}
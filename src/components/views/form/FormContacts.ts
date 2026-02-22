import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { IBuyer } from "../../../types";

export type TFormContactsData = Pick<IBuyer, 'email' | 'phone'>;

export class FormContacts extends Form<TFormContactsData> {
    protected emailInputElement: HTMLInputElement;
    protected phoneInputElement: HTMLInputElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.emailInputElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInputElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInputElement.addEventListener('input', () => {
            this.events.emit('emailInput:change', {email: this.emailInputElement.value});
        })

        this.phoneInputElement.addEventListener('input', ()=> {
            this.events.emit('phoneInput:change', {phone: this.phoneInputElement.value});
        })
    }

    set email(value: string) {
        this.emailInputElement.value = value;
    }

    set phone(value: string) {
        this.phoneInputElement.value = value;
    }
}
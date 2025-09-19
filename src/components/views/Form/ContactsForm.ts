import { ensureElement } from "../../../utils/utils";
import { Form, IFormActions } from "./Form";

export interface IContactsFormActions extends IFormActions {
    onInputChange?: (field: string, value: string) => void;
}

export interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, actions?: IContactsFormActions) {
        super(container, actions);

        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        // Обработка изменения полей
        this._emailInput.addEventListener('input', () => {
            this.validateForm();
            if (actions?.onInputChange) {
                actions.onInputChange('email', this._emailInput.value);
            }
        });

        this._phoneInput.addEventListener('input', () => {
            this.validateForm();
            if (actions?.onInputChange) {
                actions.onInputChange('phone', this._phoneInput.value);
            }
        });
    }

    set email(value: string) {
        this._emailInput.value = value;
        this.validateForm();
    }

    set phone(value: string) {
        this._phoneInput.value = value;
        this.validateForm();
    }

    get email(): string {
        return this._emailInput.value;
    }

    get phone(): string {
        return this._phoneInput.value;
    }

    get formData(): IContactsFormData {
        return {
            email: this.email,
            phone: this.phone
        };
    }

    private validateForm(): void {
        const emailValue = this._emailInput.value.trim();
        const phoneValue = this._phoneInput.value.trim();

        const isEmailFilled = emailValue.length > 0;
        const isPhoneFilled = phoneValue.length > 0;
        const isEmailValid = isEmailFilled && this.isValidEmail(emailValue);
        const isPhoneValid = isPhoneFilled && this.isValidPhone(phoneValue);

        this.valid = isEmailValid && isPhoneValid;

        // Показываем ошибки
        if (!isEmailFilled && !isPhoneFilled) {
            this.errors = 'Введите корректный email и телефон';
        } else if (!isEmailFilled) {
            this.errors = 'Поле почты не заполнено';
        } else if (!isPhoneFilled) {
            this.errors = 'Поле телефона не заполнено';
        } else if (!isEmailValid) {
            this.errors = 'Введите корректный email';
        } else if (!isPhoneValid) {
            this.errors = 'Введите корректный телефон';
        } else {
            this.clearErrors();
        }
    }

    private isValidEmail(email: string): boolean {
        return email.includes('@') && email.includes('.');
    }

    private isValidPhone(phone: string): boolean {
        return phone.includes('+') && phone.includes('7') && phone.length === 12;
    }
}
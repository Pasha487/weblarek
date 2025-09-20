import { ensureElement } from "../../../utils/utils"; 
import { IValidationResult } from "../../../types";
import { Form, IFormActions } from "./Form"; 

export interface IContactsFormActions extends IFormActions { 
    onEmailChange?: (email: string) => void;
    onPhoneChange?: (phone: string) => void;
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
            if (actions?.onEmailChange) { 
                actions.onEmailChange(this._emailInput.value); 
            }
        });

        this._phoneInput.addEventListener('input', () => {
            if (actions?.onPhoneChange) { 
                actions.onPhoneChange(this._phoneInput.value); 
            }
        });
    } 

    set email(value: string) { 
        this._emailInput.value = value;
    } 

    set phone(value: string) { 
        this._phoneInput.value = value;
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

    setValidationErrors(errors: IValidationResult): void {
        const errorMessages = Object.values(errors).filter(Boolean);
        if (errorMessages.length > 0) {
            this.errors = errorMessages.join(', ');
            this.valid = false;
        } else {
            this.clearErrors();
            this.valid = true;
        }
    }
}
import { ensureElement } from "../../../utils/utils"; 
import { TPayment, IValidationResult } from "../../../types"; 
import { Form, IFormActions } from "./Form"; 

export interface IOrderFormActions extends IFormActions { 
    onPaymentChange?: (payment: TPayment) => void; 
    onAddressChange?: (address: string) => void;
} 

export interface IOrderFormData { 
    payment: TPayment; 
    address: string; 
} 

export class OrderForm extends Form { 
    protected _paymentButtons: HTMLButtonElement[]; 
    protected _addressInput: HTMLInputElement; 

    constructor(container: HTMLElement, actions?: IOrderFormActions) { 
        super(container, actions); 

        this._paymentButtons = Array.from(ensureElement<HTMLElement>('.order__buttons', this.container).querySelectorAll('button')) as HTMLButtonElement[]; 
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container); 

        // Обработка выбора способа оплаты 
        this._paymentButtons.forEach(button => { 
            button.addEventListener('click', () => { 
                this.selectPayment(button.name as TPayment); 
                if (actions?.onPaymentChange) { 
                    actions.onPaymentChange(button.name as TPayment); 
                }
            }); 
        }); 

        // Обработка изменения адреса 
        this._addressInput.addEventListener('input', () => { 
            if (actions?.onAddressChange) {
                actions.onAddressChange(this._addressInput.value);
            }
        }); 
    } 

    set payment(value: TPayment) { 
        this.selectPayment(value); 
    } 

    set address(value: string) { 
        this._addressInput.value = value;
    } 

    get payment(): TPayment { 
        const selectedButton = this._paymentButtons.find(button =>  
            button.classList.contains('button_alt-active') 
        ); 
        return selectedButton?.name as TPayment || 'card'; 
    } 

    get address(): string { 
        return this._addressInput.value; 
    } 

    get formData(): IOrderFormData { 
        return { 
            payment: this.payment, 
            address: this.address 
        }; 
    } 

    private selectPayment(payment: TPayment): void { 
        this._paymentButtons.forEach(button => { 
            button.classList.toggle('button_alt-active', button.name === payment); 
        });
    } 

    // Метод для установки ошибок валидации из модели
    setValidationErrors(errors: IValidationResult): void {
        const errorMessage = Object.values(errors).filter(Boolean);
        if (errorMessage.length > 0) {
            this.errors = errorMessage.join(', ');
            this.valid = false;
        } else {
            this.clearErrors();
            this.valid = true;
        }
    }
} 

import { IValidationResult } from "../../../types";
import { ensureElement } from "../../../utils/utils"; 
import { Component } from "../../base/Component"; 

export interface IFormActions { 
    onSubmit?: (event: Event) => void; 
}

export class Form extends Component<{}> { 
    protected _submitButton: HTMLButtonElement; 
    protected _errorsElement: HTMLElement; 

    constructor(container: HTMLElement, actions?: IFormActions) { 
        super(container); 

        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container); 
        this._errorsElement = ensureElement<HTMLElement>('.form__errors', this.container); 

        if (actions?.onSubmit) { 
            this.container.addEventListener('submit', actions.onSubmit); 
        } 
    } 

    set valid(value: boolean) { 
        this._submitButton.disabled = !value; 
    } 

    set errors(value: string) { 
        this.setText(this._errorsElement, value); 
    } 

    clearErrors(): void { 
        this.setText(this._errorsElement, ''); 
    } 

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

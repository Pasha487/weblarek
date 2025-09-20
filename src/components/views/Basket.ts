import { ensureElement } from "../../utils/utils"; 
import { Component } from "../base/Component"; 

export interface IBasket { 
    items: HTMLElement[]; 
    total: number; 
} 

export interface IBasketActions { 
    onOrder?: () => void; 
} 

export class Basket extends Component<IBasket> { 
    protected _list: HTMLElement; 
    protected _total: HTMLElement; 
    protected _button: HTMLButtonElement; 

    constructor(container: HTMLElement, actions?: IBasketActions) { 
        super(container); 

        this._list = ensureElement<HTMLElement>('.basket__list', this.container); 
        this._total = ensureElement<HTMLElement>('.basket__price', this.container); 
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container); 

        if (actions?.onOrder) { 
            this._button.addEventListener('click', actions.onOrder); 
        } 
    } 

    set items(value: HTMLElement[]) { 
        this._list.replaceChildren(...value); 
    } 

    set total(value: number) { 
        this.setText(this._total, `${value} синапсов`); 
    } 

    set buttonText(value: string) { 
        this.setText(this._button, value); 
    } 

    set buttonDisabled(value: boolean) { 
        this._button.disabled = value; 
    } 
} 
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IOrderSuccess {
    total: number;
}

export interface IOrderSuccessActions {
    onClose?: () => void;
}

export class OrderSuccess extends Component<IOrderSuccess> {
    protected _title: HTMLElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IOrderSuccessActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.order-success__title', this.container);
        this._description = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._button = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (actions?.onClose) {
            this._button.addEventListener('click', actions.onClose);
        }
    }

    set total(value: number) {
        this.setText(this._description, `Списано ${value} синапсов`);
    }

    private setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }
}

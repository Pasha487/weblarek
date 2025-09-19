import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { Card, ICardActions } from "./Card";

export interface ICardBasketActions extends ICardActions {
    onRemove?: (event: MouseEvent) => void;
}

export type TCardBasket = Pick<IProduct, 'title' | 'price'> & { index: number };

export class CardBasket extends Card {
    protected _index: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardBasketActions) {
        super(container, actions);

        this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onRemove) {
            this._button.addEventListener('click', actions.onRemove);
        }
    }

    set index(value: number) {
        this.setText(this._index, String(value));
    }
}
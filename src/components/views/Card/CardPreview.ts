import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { Card, ICardActions } from "./Card";

export interface ICardPreviewActions extends ICardActions {
    onAddToCart?: (event: MouseEvent) => void;
}

export type TCardPreview = Pick<IProduct, 'title' | 'price' | 'category' | 'image' | 'description'>;

export class CardPreview extends Card {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardPreviewActions) {
        super(container, actions);

        this._description = ensureElement<HTMLElement>('.card__text', this.container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onAddToCart) {
            this._button.addEventListener('click', actions.onAddToCart);
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }
}

import { IProduct } from "../../../types";
import { Card, ICardActions } from "./Card";

export type TCardCatalog = Pick<IProduct, 'title' | 'price' | 'category' | 'image'>;

export class CardCatalog extends Card {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);
    }
}
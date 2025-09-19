import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IProduct } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";

export interface ICardActions {
    onClick?: (event: MouseEvent) => void;
}

export type TCard = Pick<IProduct, 'title' | 'price' | 'category' | 'image'>;

export class Card extends Component<TCard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', this.container);
        this._price = ensureElement<HTMLElement>('.card__price', this.container);
        
        // Image element is optional for basket cards
        try {
            this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
        } catch (error) {
            this._image = null as any; // Will be handled in setter
        }
        
        // Category element is optional for basket cards
        try {
            this._category = ensureElement<HTMLElement>('.card__category', this.container);
        } catch (error) {
            this._category = null as any; // Will be handled in setter
        }

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            
            // Удаляем все модификаторы категории
            Object.values(categoryMap).forEach(modifier => {
                this._category.classList.remove(modifier);
            });
            
            // Добавляем нужный модификатор
            const modifier = categoryMap[value as keyof typeof categoryMap];
            if (modifier) {
                this._category.classList.add(modifier);
            }
        }
    }

    set image(value: string) {
        if (this._image) {
            const fullImageUrl = `${CDN_URL}${value}`;
            this.setImage(this._image, fullImageUrl, this.title);
        }
    }

    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt && element.alt === '') {
                element.alt = alt;
            }
        }
    }
}

import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Cart {
    private _items: IProduct[] = [];

    constructor(protected events: EventEmitter) {}

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        this._items.push(product);
        this.emitChange();
    }

    removeItem(product: IProduct): void {
        this._items = this._items.filter(item => item.id !== product.id);
        this.emitChange();
    }

    clear(): void {
        this._items = [];
        this.emitChange();
    }

    getTotalPrice(): number {
        return this._items.reduce((total, item) => total + (item.price || 0), 0);
    }

    getItemsCount(): number {
        return this._items.length;
    }

    hasItem(id: string): boolean {
        return this._items.some(item => item.id === id);
    }

    private emitChange(): void {
        this.events.emit('cart:changed', {
            items: this._items,
            total: this.getTotalPrice()
        });
    }
}
import { IProduct } from "../../types";

export class Cart {
    private _items: IProduct[] = [];

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        this._items.push(product);
    }

    removeItem(product: IProduct): void {
        this._items = this._items.filter(item => item.id !== product.id);
    }

    clear(): void {
        this._items = [];
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
}
import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class ProductCatalog {
    private _products: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;

    constructor(protected events: EventEmitter) {}

    setProducts(products: IProduct[]): void {
        this._products = products;
        this.events.emit('catalog:changed', { products: this._products });
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    getProductById(id: string): IProduct | null {
        return this._products.find(product => product.id === id) || null;
    }

    setSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
        this.events.emit('product:selected', { product: this._selectedProduct });
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}
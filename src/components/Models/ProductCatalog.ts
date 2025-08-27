import { IProduct } from "../../types";

export class ProductCatalog {
    private _products: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;

    setProducts(products: IProduct[]): void {
        this._products = products;
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    getProductById(id: string): IProduct | null {
        return this._products.find(product => product.id === id) || null;
    }

    setSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}
import { TPayment, IBuyer, IValidationResult } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
    private _payment: TPayment | null = null;
    private _email: string = '';
    private _phone: string = '';
    private _address: string = '';

    constructor(protected events: EventEmitter) {}

    setBuyerData(data: IBuyer): void {
        this._payment = data.payment;
        this._email = data.email;
        this._phone = data.phone;
        this._address = data.address;
        this.emitChange();
    }

    // Универсальный метод для установки полей
    setDataField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        switch (field) {
            case 'payment':
                this._payment = value as TPayment;
                break;
            case 'email':
                this._email = value as string;
                break;
            case 'phone':
                this._phone = value as string;
                break;
            case 'address':
                this._address = value as string;
                break;
        }
        this.emitChange();
    }

    getBuyerData(): IBuyer {
        return {
            payment: this._payment!,
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    clearData(): void {
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
    }

    validateData(): IValidationResult {
        const errors: IValidationResult = {};

        const { _payment, _email, _phone, _address } = this;
        
        // Валидация способа оплаты
        if (!_payment) {
            errors.payment = 'Способ оплаты не выбран';
        }

        // Валидация email
        if (!_email) {
            errors.email = 'Email не указан';
        }

        // Валидация телефона
        if (!_phone) {
            errors.phone = 'Телефон не указан';
        }

        // Валидация адреса
        if (!_address) {
            errors.address = 'Адрес не указан';
        }

        return errors;
    }

    private emitChange(): void {
        this.events.emit('buyer:changed', { buyer: this.getBuyerData() });
    }
}
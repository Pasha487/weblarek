import { TPayment, IBuyer, IValidationResult } from "../../types";

export class Buyer {
    private _payment: TPayment | null = null;
    private _email: string = '';
    private _phone: string = '';
    private _address: string = '';

    setBuyerData(data: IBuyer): void {
        this._payment = data.payment;
        this._email = data.email;
        this._phone = data.phone;
        this._address = data.address;
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
        } else if (!/\S+@\S+\.\S+/.test(_email)) {
            errors.email = 'Некорректный формат email';
        }

        // Валидация телефона
        if (!_phone) {
            errors.phone = 'Телефон не указан';
        } else if (!/^\+?[0-9]{10,15}$/.test(_phone)) {
            errors.phone = 'Некорректный формат телефона';
        }

        // Валидация адреса
        if (!_address) {
            errors.address = 'Адрес не указан';
        }

        return errors;
    }
}
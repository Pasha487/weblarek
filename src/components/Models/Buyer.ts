import { TPayment, IBuyer } from "../../types";

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

    // Индивидуальные методы для лучшей типобезопасности
    setPayment(value: TPayment): void {
        this._payment = value;
    }

    setEmail(value: string): void {
        this._email = value;
    }

    setPhone(value: string): void {
        this._phone = value;
    }

    setAddress(value: string): void {
        this._address = value;
    }

    getBuyerData(): IBuyer | null {
        if (!this.validateData()) return null;
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

    validateData(): boolean {
        const { _payment, _email, _phone, _address } = this;
        return !!_payment && !!_email && !!_phone && !!_address;
    }
}
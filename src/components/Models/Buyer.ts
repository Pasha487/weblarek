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

        // Валидация адреса 
        if (!_address) { 
            errors.address = 'Адрес доставки не введён'; 
        } 

        // Валидация email (только если заполнен)
        if (_email && !this.isValidEmail(_email)) {
            errors.email = 'Введите корректный email';
        }

        // Валидация телефона (только если заполнен)
        if (_phone && !this.isValidPhone(_phone)) {
            errors.phone = 'Введите корректный телефон'; 
        } 

        return errors; 
    }

    // Валидация только для первого шага (способ оплаты и адрес)
    validateOrderStep(): IValidationResult {
        const errors: IValidationResult = {};
        
        // Валидация способа оплаты 
        if (!this._payment) { 
            errors.payment = 'Способ оплаты не выбран'; 
        } 

        // Валидация адреса 
        if (!this._address) { 
            errors.address = 'Адрес доставки не введён'; 
        } 

        return errors; 
    }

    // Валидация только для второго шага (email и телефон)
    validateContactsStep(): IValidationResult {
        const errors: IValidationResult = {}; 
        
        // Валидация email 
        if (!this._email) { 
            errors.email = 'Поле почты не заполнено'; 
        } else if (!this.isValidEmail(this._email)) {
            errors.email = 'Введите корректный email';
        }

        // Валидация телефона 
        if (!this._phone) { 
            errors.phone = 'Поле телефона не заполнено'; 
        } else if (!this.isValidPhone(this._phone)) {
            errors.phone = 'Введите корректный телефон'; 
        } 

        return errors; 
    }

    private isValidEmail(email: string): boolean { 
        return email.includes('@') && email.includes('.'); 
    } 

    private isValidPhone(phone: string): boolean { 
        return phone.includes('+') && phone.includes('7') && phone.length === 12;
    } 
    
    private emitChange(): void { 
        this.events.emit('buyer:changed', { buyer: this.getBuyerData() }); 
    } 
} 
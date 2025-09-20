import { ensureElement } from "../../utils/utils"; 
import { Component } from "../base/Component"; 
import { EventEmitter } from "../base/Events"; 

export interface IModal { 
    content: HTMLElement; 
} 

export class Modal extends Component<IModal> { 
    protected _closeButton: HTMLButtonElement; 
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) { 
        super(container); 

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container); 
        this._content = ensureElement<HTMLElement>('.modal__content', this.container); 

        this._closeButton.addEventListener('click', () => { 
            this.close(); 
        }); 

        this.container.addEventListener('click', (e) => { 
            if (e.target === this.container) { 
                this.close(); 
            } 
        }); 

        // Закрытие по клавише Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.container.classList.contains('modal_active')) {
                this.close();
            }
        });
    }

    set content(value: HTMLElement) { 
        this._content.replaceChildren(value); 
    }

    open(): void { 
        this.container.classList.add('modal_active'); 
        document.body.classList.add('modal-open'); 
        // Предотвращаем скролл страницы 
        document.body.style.overflow = 'hidden'; 
        this.events.emit('modal:open'); 
    } 

    close(): void { 
        this.container.classList.remove('modal_active');
        document.body.classList.remove('modal-open');
        // Восстанавливаем скролл страницы
        document.body.style.overflow = '';
        this.events.emit('modal:close');
    } 

    render(data?: Partial<IModal>): HTMLElement { 
        if (data?.content) { 
            this.content = data.content; 
        } 
        return this.container; 
    } 
} 
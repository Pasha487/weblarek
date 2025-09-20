import './scss/styles.scss'; 
import { apiProducts } from './utils/data'; 
import { ProductCatalog } from './components/Models/ProductCatalog'; 
import { Buyer } from './components/Models/Buyer'; 
import { Cart } from './components/Models/Cart'; 
import { WebLarekApi } from './components/Services/WebLarekApi'; 
import { Api } from './components/base/Api'; 
import { API_URL } from './utils/constants'; 
import { IProduct, IOrderRequest } from './types'; 
import { EventEmitter } from './components/base/Events'; 
import { ensureElement, cloneTemplate } from './utils/utils'; 

// Импорт компонентов представления 
import { Header } from './components/views/Header'; 
import { Gallery } from './components/views/Gallery'; 
import { Modal } from './components/views/Modal'; 
import { Basket } from './components/views/Basket'; 
import { OrderSuccess } from './components/views/OrderSuccess'; 
import { CardCatalog } from './components/views/Card/CardCatalog'; 
import { CardPreview } from './components/views/Card/CardPreview'; 
import { CardBasket } from './components/views/Card/CardBasket'; 
import { OrderForm } from './components/views/Form/OrderForm'; 
import { ContactsForm } from './components/views/Form/ContactsForm'; 


// Инициализация брокера событий 
const events = new EventEmitter(); 

// Инициализация моделей данных 
const productCatalog = new ProductCatalog(events); 
const cart = new Cart(events); 
const buyer = new Buyer(events); 

// Инициализация API 
const api = new Api(API_URL); 
const webLarekApi = new WebLarekApi(api); 

// Инициализация компонентов представления 
const header = new Header(events, ensureElement('.header')); 
const gallery = new Gallery(ensureElement('.gallery')); 
const modal = new Modal(ensureElement('#modal-container'), events);

// Переменные для хранения ссылок на активные формы
let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;

// Получение шаблонов 
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); 
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); 
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); 
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket'); 
const orderTemplate = ensureElement<HTMLTemplateElement>('#order'); 
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts'); 
const successTemplate = ensureElement<HTMLTemplateElement>('#success'); 

// Обработка изменения каталога товаров 
events.on('catalog:changed', () => { 
    const products = productCatalog.getProducts(); 
    const itemCards = products.map((item) => { 
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), { 
            onClick: () => events.emit('card:select', { product: item}), 
        }); 
        return card.render(item); 
    }); 
    gallery.render({ catalog: itemCards }); 
}); 

// Обработка выбора карточки товара 
events.on('card:select', (data: { product: IProduct }) => { 
    const product = data.product; 
    productCatalog.setSelectedProduct(product); 

    const isInCart = cart.hasItem(product.id); 
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), { 
        onAddToCart: () => { 
            if (isInCart) { 
                events.emit('card:remove', { product }); 
            } else { 
                events.emit('card:add', { product }); 
            } 
        }, 
    }); 

    // Настройка кнопки в зависимости от состояния 
    if (product.price === null) { 
        card.buttonText = 'Недоступно'; 
        card.buttonDisabled = true; 
    } else if (isInCart) { 
        card.buttonText = 'Удалить из корзины'; 
        card.buttonDisabled = false; 
    } else { 
        card.buttonText = 'Купить'; 
        card.buttonDisabled = false; 
    } 

    modal.render({ content: card.render(product) }); 
    modal.open(); 
}); 

// Обработка добавления товара в корзину 
events.on('card:add', (data: { product: IProduct }) => { 
    cart.addItem(data.product); 
    // events.emit('basket:open'); 
    modal.close();
}); 

// Обработка изменения корзины 
events.on('cart:changed', () => { 
    header.counter = cart.getItemsCount(); 
}); 

// Обработка изменения данных покупателя
events.on('buyer:changed', () => {
    // Валидация для первого шага (способ оплаты и адрес)
    if (currentOrderForm) {
        const orderValidationErrors = buyer.validateOrderStep();
        currentOrderForm.setValidationErrors(orderValidationErrors);
    } 
    
    // Валидация для второго шага (email и телефон)
    if (currentContactsForm) {
        const contactsValidationErrors = buyer.validateContactsStep();
        currentContactsForm.setValidationErrors(contactsValidationErrors);
    }
});

// Обработка открытия корзины 
events.on('basket:open', () => { 
    const basket = new Basket(cloneTemplate(basketTemplate), { 
        onOrder: () => events.emit('basket:order'), 
    }); 

    const cartItems = cart.getItems(); 
    const basketItems = cartItems.map((item, index) => { 
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), { 
            onRemove: () => events.emit('card:remove', { product: item }), 
        }); 
        return card.render({  
            title: item.title, 
            price: item.price, 
            index: index + 1 
        } as any); 
    }); 

    // Если корзина пуста, показываем сообщение 
    if (cartItems.length === 0) { 
        const emptyMessage = document.createElement('div'); 
        emptyMessage.className = 'basket__empty'; 
        emptyMessage.textContent = 'Корзина пуста'; 
        basket.items = [emptyMessage]; 
        basket.buttonDisabled = true; 
        basket.buttonText = 'Оформить'; 
    } else { 
        basket.items = basketItems; 
        basket.buttonDisabled = false; 
        basket.buttonText = 'Оформить'; 
    } 

    basket.total = cart.getTotalPrice(); 
    modal.render({ content: basket.render() }); 
    modal.open(); 
}); 

// Обработка удаления товара из корзины 
events.on('card:remove', (data: { product: IProduct }) => { 
    cart.removeItem(data.product); 
    modal.close(); 
}); 

// Обработка оформления заказа 
events.on('basket:order', () => { 
    currentOrderForm = new OrderForm(cloneTemplate(orderTemplate), { 
        onSubmit: (event: Event) => { 
            event.preventDefault(); 
            const formData = currentOrderForm!.formData; 
            buyer.setBuyerData({ 
                payment: formData.payment, 
                address: formData.address, 
                email: '', 
                phone: '', 
            }); 
            events.emit('order:submit', formData); 
        }, 
        onPaymentChange: (payment) => { 
            // Обновляем модель при изменении способа оплаты
            buyer.setDataField('payment', payment);
        },
        onAddressChange: (address) => {
            // Обновляем модель при изменении адреса
            buyer.setDataField('address', address);
        }, 
    }); 

    currentOrderForm.payment = buyer.getBuyerData().payment || 'card';
    currentOrderForm.address = buyer.getBuyerData().address;

    modal.render({ content: currentOrderForm.render() }); 
    modal.open(); 
}); 

// Обработка отправки формы заказа 
events.on('order:submit', () => { 
    currentContactsForm = new ContactsForm(cloneTemplate(contactsTemplate), { 
        onSubmit: (event: Event) => { 
            event.preventDefault(); 
            const formData = currentContactsForm!.formData; 
            buyer.setDataField('email', formData.email); 
            buyer.setDataField('phone', formData.phone); 
            events.emit('contacts:submit', formData); 
        }, 
        onEmailChange: (email) => {
            // Обновляем модель при изменении email
            buyer.setDataField('email', email);
        },
        onPhoneChange: (phone) => {
            buyer.setDataField('phone', phone);
        },
    }); 

    currentContactsForm.email = buyer.getBuyerData().email;
    currentContactsForm.phone = buyer.getBuyerData().phone;

    modal.render({ content: currentContactsForm.render() }); 
    modal.open(); 
});

// Обработка отправки формы контактов 
events.on('contacts:submit', async (data: { email: string; phone: string }) => { 
    try { 
        const orderData: IOrderRequest = { 
            payment: buyer.getBuyerData().payment, 
            email: data.email, 
            phone: data.phone, 
            address: buyer.getBuyerData().address, 
            total: cart.getTotalPrice(), 
            items: cart.getItems().map(item => item.id), 
        }; 

        const result = await webLarekApi.submitOrder(orderData); 

        const orderSuccess = new OrderSuccess(cloneTemplate(successTemplate), { 
            onClose: () => { 
                modal.close(); 
                cart.clear(); 
                buyer.clearData(); 
            }, 
        }); 

        orderSuccess.render({ total: result.total }); 
        modal.render({ content: orderSuccess.render() }); 
        modal.open(); 

    } catch (error) { 
        console.error('Ошибка при оформлении заказа:', error); 
        // Показываем ошибку пользователю 
        const errorMessage = document.createElement('div'); 
        errorMessage.className = 'order-error'; 
        errorMessage.innerHTML = ` 
            <h2 class="modal__title">Ошибка</h2> 
            <p>Произошла ошибка при оформлении заказа. Попробуйте еще раз.</p> 
            <button class="button" onclick="document.querySelector('.modal__close').click()">Закрыть</button> 
        `; 
        modal.render({ content: errorMessage }); 
        modal.open(); 
    } 
}); 

// Обработка закрытия модального окна 
events.on('modal:close', () => { 
    // Очищаем ссылки на формы при закрытии модального окна
    currentOrderForm = null;
    currentContactsForm = null;
}); 

// Загрузка товаров с сервера 
webLarekApi.getProductList() 
    .then((products: IProduct[]) => { 
        productCatalog.setProducts(products); 
    }) 
    .catch((error) => { 
        console.error('Ошибка при загрузке товаров:', error); 
        // Fallback на локальные данные 
        productCatalog.setProducts(apiProducts.items); 
    }); 
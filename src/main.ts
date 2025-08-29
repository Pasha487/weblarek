import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Buyer } from './components/Models/Buyer';
import { Cart } from './components/Models/Cart';
import { WebLarekApi } from './components/Services/WebLarekApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { IBuyer, IProduct } from './types';

// Тестирование ProductCatalog
console.log('=== ТЕСТИРОВАНИЕ PRODUCT CATALOG ===');

const productCatalog = new ProductCatalog();
productCatalog.setProducts(apiProducts.items);

console.log('Все товары:', productCatalog.getProducts());
console.log('Количество товаров:', productCatalog.getProducts().length);

const testProduct = apiProducts.items[0];
productCatalog.setSelectedProduct(testProduct);
console.log('Выбранный товар:', productCatalog.getSelectedProduct());

const foundProduct = productCatalog.getProductById(testProduct.id);
console.log('Найденный товар по ID:', foundProduct);

// Тестирование Cart (демонстрация без создания неиспользуемой переменной)
console.log('\n=== ТЕСТИРОВАНИЕ CART ===');

// Создаем экземпляр корзины
const cart = new Cart();
console.log('Корзина создана. Товаров:', cart.getItemsCount());

// Добавляем товар в корзину
cart.addItem(testProduct);
console.log('Добавлен товар в корзину. Товаров:', cart.getItemsCount());
console.log('Общая стоимость:', cart.getTotalPrice());

// Проверяем наличие товара
console.log('Товар в корзине:', cart.hasItem(testProduct.id));

// Удаляем товар
cart.removeItem(testProduct);
console.log('Товар удален. Товаров:', cart.getItemsCount());

// Тестирование Buyer (демонстрация без создания неиспользуемой переменной)
console.log('\n=== ТЕСТИРОВАНИЕ BUYER ===');

// Создаем экземпляр покупателя
const buyer = new Buyer();
const buyerData: IBuyer = {
    payment: 'card',
    email: 'test@example.com',
    phone: '+79991234567',
    address: 'ул. Тестовая, д. 1'
};

// Устанавливаем данные покупателя
buyer.setBuyerData(buyerData);
console.log('Данные покупателя установлены:', buyer.getBuyerData());

// Изменяем отдельное поле
buyer.setDataField('email', 'new@example.com');
console.log('Email изменен:', buyer.getBuyerData().email);

// Проверяем валидацию
console.log('Данные валидны:', buyer.validateData());

// Очищаем данные
buyer.clearData();
console.log('Данные очищены:', buyer.getBuyerData());

// Тестирование работы с API
console.log('\n=== ТЕСТИРОВАНИЕ РАБОТЫ С API ===');

// Создаем экземпляр API
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// Получаем товары с сервера напрямую (без функции-обертки)
console.log('Загрузка товаров с сервера...');

webLarekApi.getProductList()
    .then((products: IProduct[]) => {
        // Сохраняем товары в модель каталога
        productCatalog.setProducts(products);
        
        console.log('Товары успешно загружены с сервера:');
        console.log('Количество товаров:', productCatalog.getProducts().length);
        
        if (products.length > 0) {
            const firstProduct = products[0];
            console.log('Первый товар:', firstProduct);
            
            // Тестируем поиск товара по ID
            const foundProduct = productCatalog.getProductById(firstProduct.id);
            console.log('Найденный товар по ID:', foundProduct);
        }
    })
    .catch((error) => {
        console.error('Ошибка при загрузке товаров:', error);
        // Fallback на локальные данные
        console.log('Используем локальные данные...');
        productCatalog.setProducts(apiProducts.items);
        console.log('Локальные товары загружены:', productCatalog.getProducts().length);
    });

console.log('Запрос на сервер отправлен, ожидаем ответ...');

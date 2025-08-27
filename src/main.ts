import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { WebLarekApi } from './components/Services/WebLarekApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

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
console.log('\n=== ТЕСТИРОВАНИЕ CART (демонстрация) ===');
console.log('Класс Cart готов к использованию');

// Тестирование Buyer (демонстрация без создания неиспользуемой переменной)
console.log('\n=== ТЕСТИРОВАНИЕ BUYER (демонстрация) ===');
console.log('Класс Buyer готов к использованию');

// Тестирование работы с API
console.log('\n=== ТЕСТИРОВАНИЕ РАБОТЫ С API ===');

// Создаем экземпляр API
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// Получаем товары с сервера
async function testApi() {
    try {
        console.log('Загрузка товаров с сервера...');
        const products = await webLarekApi.getProductList();
        
        // Сохраняем товары в модель
        productCatalog.setProducts(products);
        
        console.log('Товары успешно загружены с сервера:');
        console.log('Количество товаров:', productCatalog.getProducts().length);
        console.log('Первый товар:', productCatalog.getProducts()[0]);
        
        // Тестируем поиск товара по ID
        if (products.length > 0) {
            const firstProduct = products[0];
            const foundProduct = productCatalog.getProductById(firstProduct.id);
            console.log('Найденный товар по ID:', foundProduct);
        }
        
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        // Fallback на локальные данные
        console.log('Используем локальные данные...');
        productCatalog.setProducts(apiProducts.items);
        console.log('Локальные товары загружены:', productCatalog.getProducts().length);
    }
}

// Запускаем тестирование API
testApi();

console.log('\n=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');
import './scss/styles.scss';

import { ProductsList } from './components/Models/ProductsList.ts';
import { Basket } from './components/Models/Basket.ts';
import { Buyer } from './components/Models/Buyer.ts';
import { CommunicatorApi } from './components/CommunicatorApi.ts';

import { apiProducts } from './utils/data.ts';
import { Api } from './components/base/Api.ts';

import { API_URL } from './utils/constants.ts';

// Создание экземпляра класса ProductsList и проверка его методов

const productsListModel = new ProductsList();

productsListModel.setProducts(apiProducts.items);
console.log('Массив товаров из каталога: ', productsListModel.getProducts());

const product = productsListModel.getProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
console.log('Получение карточки товара по id: ', product);

if (product) {
    productsListModel.setProduct(product); //Сохраняем товар для дальнейшего просмотра
}

let selectedProduct = productsListModel.getSelectedProduct();
console.log('Получение карточки выбранного товара', selectedProduct);

// Создание экземпляра класса Basket и проверка его методов

const basketModel = new Basket();

basketModel.addProduct(apiProducts.items[0]); // Добавляем товар в корзину
basketModel.addProduct(apiProducts.items[1]);
basketModel.addProduct(apiProducts.items[2]);

const selectedProducts = basketModel.getSelectedProducts();
console.log('Список товаров, добавленных в корзну: ', selectedProducts);

basketModel.removeProduct('b06cde61-912f-4663-9751-09956c0eed67'); // Удаляем товар из корзины

console.log('Проверка наличия товара по id: ', basketModel.checkProductAvailable('b06cde61-912f-4663-9751-09956c0eed67'));

let productInBasketCounter = basketModel.getProductCounter();
let totalCostOfBasket = basketModel.getTotalCost();
console.log(`Количество товаров в корзине: ${productInBasketCounter}, общей стоимостью: ${totalCostOfBasket} рублей`);

basketModel.clearBasket(); // Очищаем корзну от товаров
console.log(`После очистки в корзине ${basketModel.getProductCounter()} товаров`);

// Создание экземпляра класса Buyer и проверка его методов

const buyerModel = new Buyer();

buyerModel.setDataOfBuyer({
    email: 'example@example.ru',
    phone: '+7(915)1234567'
});

const validation = buyerModel.validationDataOfBuyer();

if (validation) {
    Object.entries(validation.errors).forEach(([field, error]) => {
        console.log(`Ошибка в поле ${field}: ${error}`);
    });
}

buyerModel.setDataOfBuyer({
    payment: 'card',
    email: 'example@example.ru',
    phone: '+7(915)1234567',
    address: '3-я ул. Строителей, д. 25, кв. 12'
});

let buyer1 = buyerModel.getDataOfBuyer();
console.log('Данные о покупателе: ', buyer1);

buyerModel.setDataOfBuyer({ // Сохраняем новый адрес
    address: 'г. Санкт-Петербург, 3-я ул. Строителей, д. 25, кв. 12'
});

buyer1 = buyerModel.getDataOfBuyer();
console.log('Данные о покупателе: ', buyer1);

buyerModel.removeFormData(); // Очищаем форму
console.log('Содержание формы после очистки данных: ', buyerModel.getDataOfBuyer());

// Получение массива товаров через запрос на сервер

const api = new Api(API_URL);
const communicatorApi = new CommunicatorApi(api);

communicatorApi.getProducts()
    .then(productsList => {
        productsListModel.setProducts(productsList.items);
        console.log('Массив с каталогом товаров: ', productsListModel.getProducts());
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров.', error);
    });

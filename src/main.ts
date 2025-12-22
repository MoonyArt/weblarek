import './scss/styles.scss';

import { ProductsList } from './components/Models/ProductsList.ts';
import { Cart } from './components/Models/Cart.ts';
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

// Создание экземпляра класса Cart и проверка его методов

const CartModel = new Cart();

CartModel.addProduct(apiProducts.items[0]); // Добавляем товар в корзину
CartModel.addProduct(apiProducts.items[1]);
CartModel.addProduct(apiProducts.items[2]);

const selectedProducts = CartModel.getSelectedProducts();
console.log('Список товаров, добавленных в корзну: ', selectedProducts);

CartModel.removeProduct('b06cde61-912f-4663-9751-09956c0eed67'); // Удаляем товар из корзины

console.log('Проверка наличия товара по id: ', CartModel.checkProductAvailable('b06cde61-912f-4663-9751-09956c0eed67'));

let productInCartCounter = CartModel.getProductCounter();
let totalCostOfCart = CartModel.getTotalCost();
console.log(`Количество товаров в корзине: ${productInCartCounter}, общей стоимостью: ${totalCostOfCart} рублей`);

CartModel.clearCart(); // Очищаем корзну от товаров
console.log(`После очистки в корзине ${CartModel.getProductCounter()} товаров`);

// Создание экземпляра класса Buyer и проверка его методов

const BuyerModel = new Buyer();

BuyerModel.setDataOfBuyer({
    email: 'example@example.ru',
    phone: '+7(915)1234567'
});

const validation = BuyerModel.validationDataOfBuyer();

if (validation) {
    Object.entries(validation.errors).forEach(([field, error]) => {
        console.log(`Ошибка в поле ${field}: ${error}`);
    });
}

BuyerModel.setDataOfBuyer({
    payment: 'card',
    email: 'example@example.ru',
    phone: '+7(915)1234567',
    address: '3-я ул. Строителей, д. 25, кв. 12'
});

let buyer1 = BuyerModel.getDataOfBuyer();
console.log('Данные о покупателе: ', buyer1);

BuyerModel.setDataOfBuyer({ // Сохраняем новый адрес
    address: 'г. Санкт-Петербург, 3-я ул. Строителей, д. 25, кв. 12'
});

buyer1 = BuyerModel.getDataOfBuyer();
console.log('Данные о покупателе: ', buyer1);

BuyerModel.removeFormData(); // Очищаем форму
console.log('Содержание формы после очистки данных: ', BuyerModel.getDataOfBuyer());

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

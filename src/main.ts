import './scss/styles.scss';

import { EventEmitter } from './components/base/Events.ts';
import { ProductsList } from './components/Models/ProductsList.ts';
import { Basket } from './components/Models/Basket.ts';
import { Buyer } from './components/Models/Buyer.ts';
import { CommunicatorApi } from './components/CommunicatorApi.ts';

import { cloneTemplate, ensureElement } from './utils/utils.ts';
import { Api } from './components/base/Api.ts';

import { API_URL, CDN_URL } from './utils/constants.ts';

import { Header } from './components/views/Header.ts';
import { Gallery } from './components/views/Gallery.ts';
import { Modal } from './components/views/Modal.ts';
import { BasketView } from './components/views/BasketView.ts';
import { SuccessOrder } from './components/views/SuccessOrder.ts';
import { CardCatalog } from './components/views/card/CardCatalog.ts';
import { CardPreview } from './components/views/card/CardPreview.ts';
import { CardBasket } from './components/views/card/CardBasket.ts';
import { FormOrder } from './components/views/form/FormOrder.ts';
import { FormContacts } from './components/views/form/FormContacts.ts';


// Создание экземпляра брокера событий

const events = new EventEmitter();

// Создание экземпляра классов, отвечающих за работу с данными 

const productsListModel = new ProductsList(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

//Создание экземпляров классов представления

const galleryElement = ensureElement<HTMLElement>('.gallery');
const gallery = new Gallery(events, galleryElement);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardCatalog = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
    onClick: () => console.log('Клик по карточке')
})

const modalElement = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(events, modalElement);

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardPreview = new CardPreview(events, cloneTemplate(cardPreviewTemplate));

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketView = new BasketView(events, cloneTemplate(basketTemplate));

const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplate), {
    onDelete: () => console.log('Клик по кнопке удаления товара из корзины')
});

const headerElement = ensureElement<HTMLElement>('.header');
const header = new Header(events, headerElement);

const formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formOrder = new FormOrder(events, cloneTemplate(formOrderTemplate));

const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const formContacts = new FormContacts(events, cloneTemplate(formContactsTemplate));

const successOrderTemplate = ensureElement<HTMLTemplateElement>('#success');
const successOrder = new SuccessOrder(events, cloneTemplate(successOrderTemplate));

// Презентер - обработка событий в приложении

// Событие изменения списка товаров

events.on('products:changed', () => {
    const itemCards = productsListModel.getProducts().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', {id: item.id})
        });
        return card.render(item);
    })

    gallery.render({ catalog: itemCards });
})

// Выбор карточки товара для просмотра

events.on('card:select', (data: { id: string }) => {
    const product = productsListModel.getProduct(data.id);
    if (!product) return
    // Сохраняем товар, выбранный для просмотра
    productsListModel.setProduct(product);

    modal.content = cardPreview.render(product);
    modal.open();
});

// Событие изменения товара, выбранного для просмотра

events.on('product:changed', () => {
    const product = productsListModel.getSelectedProduct();
    if (!product) return;
    if (product.price === null) {
        cardPreview.buttonActive = false;
        cardPreview.buttonText = 'Недоступно';
    } else if (basketModel.checkProductAvailable(product.id)) {
        cardPreview.buttonActive = true;
        cardPreview.buttonText = 'Удалить из корзины';
    } else {
        cardPreview.buttonActive = true;
        cardPreview.buttonText = 'Купить';
    }
});

// Собыйтие изменения содержимого корзины

events.on('basket:changed', () => {
    const basketItems = basketModel.getSelectedProducts();
    const totalCost = basketModel.getTotalCost();

    const itemElements = basketItems.map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onDelete: () => events.emit('card:select-to-delete', {id: item.id})
        });
        card.index = index + 1;
        return card.render(item);
    });
        
    // Передаем карточки в BasketView
    basketView.basketList = itemElements;
    basketView.totalCost = totalCost;
    
    if (basketItems.length === 0) {
        basketView.buttonActive = false;
    } else {
        basketView.buttonActive = true;
    }

    // Обновление счетчика товаров в корзине
    header.counter = basketItems.length;
});

// Нажатие кнопки удаления товара в корзине
events.on('card:select-to-delete', (data: { id: string }) => {
    basketModel.removeProduct(data.id);
})

// Нажатие кнопки покупки/удаления товара
events.on('productButton:click', () => {
    const product = productsListModel.getSelectedProduct();
    if (!product || product.price === null) return;
    if (basketModel.checkProductAvailable(product.id)) {
        basketModel.removeProduct(product.id);
    } else {
        basketModel.addProduct(product);
    }
});

// Нажатие кнопки открытия корзины
events.on('basketButton:click', () => {
    modal.content = basketView.render();
    modal.open();
});

// Нажатие кнопки оформления заказа
events.on('order:open', () => {
    modal.content = formOrder.render();
    modal.open();
});

// Нажатие кнопки выбора способа оплаты по карте
events.on('paymentCardButton:click', (data: { payment: 'card' }) => {
    buyerModel.setDataOfBuyer({ payment: data.payment });
});

// Нажатие кнопки выбора способа оплаты наличными
events.on('paymentCashButton:click', (data: { payment: 'cash' }) => {
    buyerModel.setDataOfBuyer({ payment: data.payment });
});

// Событие изменения адреса покупателя
events.on('addressInput:change', ( data: {address: string}) => {
    buyerModel.setDataOfBuyer({ address: data.address })
});

// Событие изменения адреса электронной почты покупателя
events.on('emailInput:change', ( data: {email: string}) => {
    buyerModel.setDataOfBuyer({ email: data.email })
});

// Событие изменения телефона покупателя
events.on('phoneInput:change', ( data: {phone: string}) => {
    buyerModel.setDataOfBuyer({ phone: data.phone })
});

// Событие изменения данных покупателя
events.on('buyer:changed', () => {
    const buyerData = buyerModel.getDataOfBuyer();
    const validation = buyerModel.validationDataOfBuyer();

    formOrder.payment = buyerData.payment || '';
    formOrder.address = buyerData.address || '';

    // Проверяем наличие полей только для FormOrder
    if (buyerData.payment && buyerData.address) {
        formOrder.buttonActive = true;
        formOrder.errors = '';
    } else {
        formOrder.buttonActive = false;

        if (validation.errors.payment) {
            formOrder.errors = validation.errors.payment;
        } else if(validation.errors.address) {
            formOrder.errors = validation.errors.address;
        }
    }

    // Обработка события изменения данных в форме с контактными данными
    formContacts.email = buyerData.email || '';
    formContacts.phone = buyerData.phone || '';

    // Проверяем наличие полей только для FormContacts
    if (buyerData.email && buyerData.phone) {
        formContacts.buttonActive = true;
        formContacts.errors = '';
    } else {
        formContacts.buttonActive = false;

        if (validation.errors.email) {
            formContacts.errors = validation.errors.email;
        } else if (validation.errors.phone) {
            formContacts.errors = validation.errors.phone;
        }
    }
});

// Нажатие кнопки перехода ко второй форме оформления заказа
events.on('order:submit', () => {
    modal.content = formContacts.render();
})

// Нажатие кнопки оплаты/завершения оформления заказа
events.on('contacts:submit', () => {
    const buyerData = buyerModel.getDataOfBuyer();
    const basketItems = basketModel.getSelectedProducts();
    const total = basketModel.getTotalCost();

    const orderData = {
        payment: buyerData.payment,
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone,
        total: total,
        items: basketItems.map(item => item.id)
    };

    communicatorApi.createOrder(orderData)
        .then(response => {
            console.log('Заказ создан:', response);
            const result = response;

            successOrder.totalCost = result.total;
            modal.content = successOrder.render();

            basketModel.clearBasket();
            buyerModel.removeFormData();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            formContacts.errors = 'Не удалось оформить заказ';
        });
});

// Событие закрытия окна с сообщением об успешном оформлении заказа
events.on('successButton:click', () => {
    modal.close();
})

// Событие открытия модального окна
events.on('modal:open', () => {
    console.log('Открыто модальное окно');
})

// Событие закрытия модального окна
events.on('modal:close', () => {
    console.log('Модальное окно закрыто');
})


// Получение массива товаров через запрос на сервер

const api = new Api(API_URL);
const communicatorApi = new CommunicatorApi(api);

communicatorApi.getProducts()
    .then(productsList => {
        // Обработка каждого товара для добавления полного пути к изображениям на карточках
        const processedProducts = productsList.items.map(product => ({
            ...product,
            image: `${CDN_URL}${product.image}`
        }));
        
        // Сохранение обработанных данных в модель
        productsListModel.setProducts(processedProducts);
        console.log('Массив с каталогом товаров: ', productsListModel.getProducts());
    })

    .catch(error => {
        console.error('Ошибка загрузки товаров.', error);
    });
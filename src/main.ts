import './scss/styles.scss';

import { EventEmitter } from './components/base/Events.ts';
import { ProductsList } from './components/Models/ProductsList.ts';
import { Basket } from './components/Models/Basket.ts';
import { Buyer } from './components/Models/Buyer.ts';
import { CommunicatorApi } from './components/CommunicatorApi.ts';

import { cloneTemplate } from './utils/utils.ts';
import { apiProducts } from './utils/data.ts';
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
import { IBuyer, TBuyerErrors } from './types/index.ts';


// Создание экземпляра брокера событий

const events = new EventEmitter();
events.onAll((event) => {
    console.log('🔥🔥🔥 ГЛОБАЛЬНОЕ СОБЫТИЕ:', event.eventName, event.data);
});

// Создание экземпляра классов, отвечающих за работу с данными 

const productsListModel = new ProductsList(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

//Создание экземпляров классов представления

const galleryElement = document.querySelector('.gallery') as HTMLElement;
if (!galleryElement) {
    throw new Error('Элемент .gallery не найден');
}
const gallery = new Gallery(events, galleryElement);

const cardCatalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const cardCatalog = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
    onClick: () => console.log('Клик по карточке')
})

const modalElement = document.getElementById('modal-container') as HTMLElement;
const modal = new Modal(events, modalElement);

const cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const cardPreview = new CardPreview(events, cloneTemplate(cardPreviewTemplate));

const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const basketView = new BasketView(events, cloneTemplate(basketTemplate));

const cardBasketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
if (!cardBasketTemplate) {
    throw new Error('Элемент card-basket не найден');
}
const cardBasket = new CardBasket(events, cloneTemplate(cardBasketTemplate));

const headerElement = document.querySelector('.header') as HTMLElement;
if (!headerElement) {
    throw new Error('Элемент .header не найден');
}
const header = new Header(events, headerElement);

const formOrderTemplate = document.getElementById('order') as HTMLTemplateElement;
const formOrder = new FormOrder(events, cloneTemplate(formOrderTemplate));

const formContactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const formContacts = new FormContacts(events, cloneTemplate(formContactsTemplate));

const successOrderTemplate = document.getElementById('success') as HTMLTemplateElement;
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
    console.log('Выбран товар:', product);
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
    modal.content = cardPreview.render(product);
    modal.open();
});

// Собыйтие изменения содержимого корзины

events.on('basket:changed', () => {
    const basketItems = basketModel.getSelectedProducts();
    const totalCost = basketModel.getTotalCost();

    if (basketItems.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'Корзина пуста';
        basketView.basketList = [emptyMessage];
        basketView.totalCost = 0;
        basketView.buttonActive = false;
    } else {
        const itemElements = basketItems.map((item, index) => {
            const card = new CardBasket(events, cloneTemplate(cardBasketTemplate));
            card.index = index + 1;
            return card.render(item);
        });
        
        // Передаем карточки в BasketView
        basketView.basketList = itemElements;
        basketView.totalCost = totalCost;
        basketView.buttonActive = true;
    }

    modal.content = basketView.render();
    
    // Обновление счетчика в шапке
    if (header) {
        header.counter = basketItems.length;
    }
});

// Нажатие кнопки покупки товара
events.on('product:add-to-basket', () => {
    const product = productsListModel.getSelectedProduct();
    if (!product || product.price === null) return;
    basketModel.addProduct(product);
});

// Нажатие кнопки "Удалить из корзины" в превью карточки
events.on('product:remove-from-basket', () => {
    const product = productsListModel.getSelectedProduct();
    if (!product) return;
    
    basketModel.removeProduct(product.id);
    modal.close();
});

// Нажатие кнопки открытия корзины
events.on('basket:open', () => {
    events.emit('basket:changed');
    modal.open();
});

// Нажатие кнопки оформления заказа
events.on('order:open', () => {
    modal.content = formOrder.render();
    modal.open();
});

// Нажатие кнопки выбора способа оплаты по карте
events.on('payment:by-card', (data: { payment: 'card' }) => {
    formOrder.payment = data.payment;
    buyerModel.setDataOfBuyer({ payment: data.payment });
});

// Нажатие кнопки выбора способа оплаты наличными
events.on('payment:in-cash', (data: { payment: 'cash' }) => {
    formOrder.payment = data.payment;
    buyerModel.setDataOfBuyer({ payment: data.payment });
});

// Событие изменения адреса покупателя
events.on('order:address-change', ( data: {address: string}) => {
    buyerModel.setDataOfBuyer({ address: data.address })
    formOrder.address = data.address;
});

// Событие изменения адреса электронной почты покупателя
events.on('contacts:email-change', ( data: {email: string}) => {
    buyerModel.setDataOfBuyer({ email: data.email })
    formContacts.email = data.email;
});

// Событие изменения телефона покупателя
events.on('contacts:phone-change', ( data: {phone: string}) => {
    buyerModel.setDataOfBuyer({ phone: data.phone })
    formContacts.phone = data.phone;
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
    if (formContacts) {
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
    }
});

// Нажатие кнопки перехода ко второй форме оформления заказа
events.on('order:submit', () => {
    modal.content = formContacts.render();
})

// Нажатие кнопки оплаты/завершения оформления заказа
events.on('contacts:submit', () => {
    const totalCost = basketModel.getTotalCost();
    successOrder.totalCost = totalCost;
    modal.content = successOrder.render();
})

// Событие закрытия окна с сообщением об успешном оформлении заказа
events.on('success:close', () => {
    modal.close();
    basketModel.clearBasket();
    buyerModel.removeFormData();
})

// Событие очистки корзины
events.on('basket:cleared', () => {
    header.counter = basketModel.getSelectedProducts.length;
    console.log('Корзина очищена');
})

// Событие очистки формы с данными покупателя
events.on('buyer:cleared', () => {
    console.log('Данные покупателя очищены');
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


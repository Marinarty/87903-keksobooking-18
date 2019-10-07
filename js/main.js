'use strict';

var adverts = [];
var adsNumber = 8; // количество объявлений для генерации
var types = ['palace', 'flat', 'house', 'bungalo']; // тип жилья
var checks = ['12:00', '13:00', '14:00']; // часы заезда и выезда
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']; // удобства
var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
]; // адреса фотографий
var ENTER_KEYCODE = 13;
var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_HEIGHT = 62;
var MAIN_PIN_POINT_HEIGHT = 22;

// функция рандома
function getRandomInt(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

// функция генерации массива из объектов-объявлений
function createAds(adsLimit) {

  for (var i = 0; i < adsLimit; i++) {
    var x = getRandomInt(100, 900); // координаты метки на карте
    var y = getRandomInt(200, 600);

    adverts[i] = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png' // аватар автора объявления
      },

      'location': {
        x: x,
        y: y
      },

      'offer': {
        'title': 'Объявление номер ' + (i + 1), // заголовок объявления
        'address': x + ', ' + y,
        'price': getRandomInt(1000, 1000000),
        'type': types[getRandomInt(0, types.length - 1)],
        'rooms': getRandomInt(1, 5),
        'guests': getRandomInt(1, 10),
        'checkin': checks[getRandomInt(0, checks.length - 1)],
        'checkout': checks[getRandomInt(0, checks.length - 1)],
        'features': features.slice(Math.floor(Math.random() * features.length)), // массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"
        'description': 'Прекрасное описания объявления ' + (i + 1), // описание объявления
        'photos': photos.slice(Math.floor(Math.random() * photos.length)) // массив строк случайной длины, содержащий адреса фотографий
      },
    };
  }
  return adverts;
}

createAds(adsNumber);


var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var fragment = document.createDocumentFragment();

// создаю пин
var createPins = function (ads, id) {
  var adsElement = pinTemplate.cloneNode(true);
  adsElement.style.left = ads.location.x + 'px';
  adsElement.style.top = ads.location.y + 'px';
  adsElement.querySelector('img').src = ads.author.avatar;
  adsElement.querySelector('img').alt = ads.offer.title;
  adsElement.setAttribute('data-id', id);
  return adsElement;
};


// вывожу пин
for (var i = 0; i < adverts.length; i++) {
  fragment.appendChild(createPins(adverts[i], i));
}

// mapPins.appendChild(fragment);

// делаем элементы управления формы неактивными
var formElements = document.querySelectorAll('.map__filter');

for (var j = 0; j < formElements.length; j++) {
  formElements[j].setAttribute('disabled', 'disabled');
}

// добавляем обработчик события mousedown на элемент .map__pin--main, переводящий страницу из неактивного состояния в активное
var mainPin = document.querySelector('.map__pin--main');
var mainForm = document.querySelector('.ad-form');
var addressInput = document.getElementById('address');

// добавляем в инпут адреса изначальные координаты центра метки при неактивном состоянии страницы
var fillAddressForInactiveMap = function (element) {
  addressInput.value = Math.round(parseInt(element.style.left, 10) + MAIN_PIN_WIDTH / 2) + ', ' + (Math.round(parseInt(element.style.top, 10) + MAIN_PIN_HEIGHT / 2));
};

fillAddressForInactiveMap(mainPin);

// добавляем в инпут адреса координаты острого конца метки при активном состоянии страницы
var fillAddressForActiveMap = function (element) {
  addressInput.value = Math.round(parseInt(element.style.left, 10) + MAIN_PIN_WIDTH / 2) + ', ' + (Math.round(parseInt(element.style.top, 10) + MAIN_PIN_HEIGHT + MAIN_PIN_POINT_HEIGHT));
  addressInput.setAttribute('readonly', 'readonly');
};

var toActive = function () {
  map.classList.remove('map--faded');
  mainForm.classList.remove('ad-form--disabled');
  fillAddressForActiveMap(mainPin);
  mapPins.appendChild(fragment);

  for (var k = 0; k < formElements.length; k++) {
    formElements[k].removeAttribute('disabled', 'disabled');
  }

  var mapPin = document.querySelectorAll('.map__pin:not(.map__pin--main)');

  for (var j = 0; j < mapPin.length; j++) {
    mapPin[j].addEventListener('click', function (evt) {

      var dataId = evt.target.parentNode.getAttribute('data-id');
      document.querySelector('.map').insertBefore(createPopup(adverts[dataId]), document.querySelector('.map__filters-container'));

      var popUp = document.querySelector('.popup');
      var popupClose = document.querySelector('.popup__close');

      popupClose.addEventListener('click', function () {
        popUp.classList.add('hidden');
      });
    });
  }
};

mainPin.addEventListener('click', function () {
  toActive();
});

mainPin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    toActive();
  }
});

// сверка гостей и комнат
var inputRooms = document.getElementById('room_number');
var inputCapacity = document.getElementById('capacity');

var roomsGuests = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
};

inputRooms.addEventListener('change', function () {
  var currentValue = this.value;
  var massive = roomsGuests[currentValue];

  for (var i = 0; i < inputCapacity.options.length; i++) {
    var option = inputCapacity.options[i];
    option.disabled = true;

    for (var j = 0; j < massive.length; j++) {
      if (massive[j] === Number(option.value)) {
        option.disabled = false;
      }
    }
   }
});

// все про карточку

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var getRoomsType = function (type) {
  if (type === 'flat') {
    return 'Квартира';
  } else if (type === 'bungalo') {
    return 'Бунгало';
  } else if (type === 'house') {
    return 'Дом';
  }
  return 'Дворец';
};

var createFeatures = function (fts) {
  var featureElement = '';

  for (var j = 0; j < fts.length; j++) {
    featureElement += '<li class="popup__feature popup__feature--' + features[j] + '"></li>';
  }
  return featureElement;
};

var createPhotos = function (photo) {
  var photoElement = '';

  for (var j = 0; j < photo.length; j++) {
    photoElement += '<img src="' + photos[j] + '"' + 'class="popup__photo" width="45" height="40" alt="Фотография жилья"></img>';
  }
  return photoElement;
};

// создание карточки объявления
var createPopup = function (popup) {
  var popupElement = cardTemplate.cloneNode(true);
  popupElement.querySelector('.popup__title').textContent = popup.offer.title;
  popupElement.querySelector('.popup__text--address').textContent = popup.offer.address;
  popupElement.querySelector('.popup__text--price').textContent = popup.offer.price + ' ₽/ночь';
  popupElement.querySelector('.popup__type').textContent = getRoomsType(popup.offer.type);
  popupElement.querySelector('.popup__text--capacity').textContent = popup.offer.rooms + ' комнаты для ' + popup.offer.guests + ' гостей.';
  popupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + popup.offer.checkin + ', выезд до ' + popup.offer.checkout;
  popupElement.querySelector('.popup__features').innerHTML = createFeatures(popup.offer.features);
  popupElement.querySelector('.popup__description').textContent = popup.offer.description;
  popupElement.querySelector('.popup__photos').innerHTML = createPhotos(popup.offer.photos);
  popupElement.querySelector('.popup__avatar').src = popup.author.avatar;
  return popupElement;
};

// вставка карточки на карту


// var mapPin = document.querySelectorAll('.map__pin:not(.map__pin--main)');

// for (var j = 0; j < mapPin.length; j++) {
//   mapPin[j].addEventListener('click', function () {
//     for (var i = 0; i < adverts.length; i++) {
//       document.querySelector('.map').insertBefore(createPopup(adverts[i]), document.querySelector('.map__filters-container'));
//     }
//   });
// }

// валидация формы

var adTitleInput = document.getElementById('title');
var adPriceInput = document.getElementById('price');
var adTypeSelect = document.getElementById('type');
var adTimeInSelect = document.getElementById('timein');
var adTimeOutSelect = document.getElementById('timeout');

adTitleInput.addEventListener('invalid', function () {
  if (adTitleInput.validity.tooShort) {
    adTitleInput.setCustomValidity('Должно состоять минимум из 30 символов');
  } else if (adTitleInput.validity.tooLong) {
    adTitleInput.setCustomValidity('Не должно превышать 100 символов');
  } else if (adTitleInput.validity.valueMissing) {
    adTitleInput.setCustomValidity('Обязательно для заполнения');
  } else {
    adTitleInput.setCustomValidity('');
  }
});

adPriceInput.addEventListener('invalid', function () {
  if (adPriceInput.validity.rangeOverflow) {
    adPriceInput.setCustomValidity('Цена за ночь не должна превышать 1 000 000 рублей');
  } else if (adPriceInput.validity.rangeUnderflow) {
    adPriceInput.setCustomValidity('Цена за ночь не может быть менее 0 рублей');
  } else if (adPriceInput.validity.valueMissing) {
    adPriceInput.setCustomValidity('Обязательно для заполнения');
  } else {
    adPriceInput.setCustomValidity('');
  }
});

var checkTimeInOut = function (timeFirst, timeSecond) {
  timeSecond.value = timeFirst.value;
};

var typePrice = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};

adTypeSelect.addEventListener('change', function () {
  var currentValue = adTypeSelect.value;
  var currentPrice = typePrice[currentValue];
  adPriceInput.min = currentPrice;
  adPriceInput.placeholder = currentPrice;
});

adTimeInSelect.addEventListener('change', function () {
  checkTimeInOut(adTimeInSelect, adTimeOutSelect);
});

adTimeOutSelect.addEventListener('change', function () {
  checkTimeInOut(adTimeOutSelect, adTimeInSelect);
});

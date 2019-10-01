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
map.classList.remove('map--faded');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var fragment = document.createDocumentFragment();

var createPins = function (ads) {
  var adsElement = pinTemplate.cloneNode(true);
  adsElement.style.left = ads.location.x + 'px';
  adsElement.style.top = ads.location.y + 'px';
  adsElement.querySelector('img').src = ads.author.avatar;
  adsElement.querySelector('img').alt = ads.offer.title;
  return adsElement;
};

for (var i = 0; i < adverts.length; i++) {
  fragment.appendChild(createPins(adverts[i]));
}

mapPins.appendChild(fragment);

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

document.querySelector('.map').insertBefore(createPopup(adverts[0]), document.querySelector('.map__filters-container'));

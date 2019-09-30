'use strict';

var adverts = [];
var adsNumber = 8; // количество объявлений для генерации
var types = ['palace', 'flat', 'house', 'bungalo']; // тип жилья
var checks = ['12:00', '13:00', '14:00']; // часы заезда и выезда
// !!здесь я отъезды и выезды объединила, так как это одинаковые часы. Возможно, в будущем окажется  что делать этого не стоило? Ну, например, логично, что заезд не может быть раньше выезда.
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
// !!здесь наставник предложил "не заморачиваться" и взять вот такой диапазон, потмоу что "все равно данные будут с сервиса приходить", поэтмоу точное положение конца метки я не искала:(

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
// !! наставник предложил использовать вместо ифа свитч, но я не знаю, почему он эффективнее, чем иф.

var createFeatures = function (fts) {

  for (var j = 0; j < fts.length; j++) {
    var featureElement = document.createElement('li');
    featureElement.className = 'popup__feature ' + 'popup__feature--' + features[j];
    fragment.appendChild(featureElement);
  }
  return fragment;
};

var createPhotos = function (photo) {

  for (var j = 0; j < photo.length; j++) {
    var photoElement = document.createElement('img');
    photoElement.className = 'popup__photo';
    photoElement.src = photos[j];
    photoElement.width = 45;
    photoElement.height = 40;
    photoElement.alt = 'фото жилья ' + (j + 1);
    fragment.appendChild(photoElement);
  }
  return fragment;
};

var createPopup = function (popup) {
  var popupElement = cardTemplate.cloneNode(true);
  popupElement.querySelector('.popup__title').textContent = popup.offer.title;
  popupElement.querySelector('.popup__text--address').textContent = popup.offer.address;
  popupElement.querySelector('.popup__text--price').textContent = popup.offer.price + ' ₽/ночь';
  popupElement.querySelector('.popup__type').textContent = getRoomsType(popup.offer.type);
  popupElement.querySelector('.popup__text--capacity').textContent = popup.offer.rooms + ' комнаты для ' + popup.offer.guests + ' гостей.';
  popupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + popup.offer.checkin + ', выезд до ' + popup.offer.checkout;
  popupElement.querySelector('.popup__features').appendChild(createFeatures(popup.offer.features));
  popupElement.querySelector('.popup__description').textContent = popup.offer.description;
  popupElement.querySelector('.popup__photos').appendChild(createPhotos(popup.offer.photos));
  popupElement.querySelector('.popup__avatar').src = popup.author.avatar;
  return popupElement;
};

document.querySelector('.map').insertBefore(createPopup(adverts[0]), document.querySelector('.map__filters-container'));

// !! как видишь, я элементы то создала и все прекрасно-радужно, н оте что в разметки - они остались. И вот я думаю, их надо удалять через remove и писать, какой по счету элемент удалить,
// !! или изменить весь механизм и сделать все через innerHTML, чтобы заменять всю разметку сразу?

// !! у меня огромнео непонимание про передачу параметров в функцию. Зачем это нужно делать всегда?
// !! Например, вот эта функция function createAds() - работает и без передачи параметра.
// !! Я могу писать for (var i = 0; i < adsNumber; i++) и все работает. А если я передам параметр  createAds(adsNumber), то ругается линтер, потому что переменная уже задана выше.
// !! У него на это есть право, наверно, но почему, я не понимаю.

// !! В связи с непониманием передачи параметров, мне, например, не понятно, почему вот здесь:
// !! popupElement.querySelector('.popup__text--price').textContent = popup.offer.price + ' ₽/ночь';
// !! мы пишем popup.offer.price, а не adverts.offer.price, мы же эти данные из этого объекта берем ?

// !! По-моему, у меня и задание функций записано разными способами, а это критерию противоречит, да и переменные некоторые капсом должны быть, наврено.
// !! Как видишь, полная каша в голове:) А код я пишу большей частью методом тыка, гугла и обрывочных знаний.

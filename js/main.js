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
]; //адреса фотографий
var x;
var y;

// функция рандома
function getRandomInt(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

// функция генерации массива из объектов-объявлений
function createAds(adsNumber) {

  for (var i = 0; i < adsNumber; i++) {
    adverts[i] = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png' // аватар автора объявления
      },

      'location': {
        x: getRandomInt(130, 630), // случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка
        y: getRandomInt(130, 630), // посчитать координаты , беря во внимание ширину и  высоту метки
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
        'description': 'Прекрасное описания объявления ' + (i + 1),
        'photos': photos.slice(Math.floor(Math.random() * photos.length)) // массив строк случайной длины, содержащий адреса фотографий
      },
    };
  };
  return adverts;
};

createAds(adsNumber);

var map = document.querySelector(".map");
map.classList.remove("map--faded");
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var fragment = document.createDocumentFragment();

var createPins = function (adverts) {
  var advertsElement = pinTemplate.cloneNode(true);
  advertsElement.style.left = adverts.location.x + 'px';
  advertsElement.style.top = adverts.location.y + 'px';
  advertsElement.querySelector('img').src = adverts.author.avatar;
  advertsElement.querySelector('img').alt = adverts.offer.title;
  return advertsElement;
};

for (var i = 0; i < adverts.length; i++) {
  fragment.appendChild(createPins(adverts[i]));
}

mapPins.appendChild(fragment);

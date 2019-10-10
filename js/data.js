// модуль, создающий данные
'use strict';

(function () {
  var adverts = [];
  var ADS_NUMBER = 8; // количество объявлений для генерации
  var TYPES = ['palace', 'flat', 'house', 'bungalo']; // тип жилья
  var CHECKS = ['12:00', '13:00', '14:00']; // часы заезда и выезда
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']; // удобства
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ]; // адреса фотографий

  // функция генерации массива из объектов-объявлений
  var createAds = function (adsLimit) {

    for (var i = 0; i < adsLimit; i++) {
      var X = window.utils.getRandomInt(100, 900); // координаты метки на карте
      var Y = window.utils.getRandomInt(200, 600);

      adverts[i] = {
        'author': {
          'avatar': 'img/avatars/user0' + (i + 1) + '.png' // аватар автора объявления
        },

        'location': {
          x: X,
          y: Y
        },

        'offer': {
          'title': 'Объявление номер ' + (i + 1), // заголовок объявления
          'address': X + ', ' + Y,
          'price': window.utils.getRandomInt(1000, 1000000),
          'type': TYPES[window.utils.getRandomInt(0, TYPES.length - 1)],
          'rooms': window.utils.getRandomInt(1, 5),
          'guests': window.utils.getRandomInt(1, 10),
          'checkin': CHECKS[window.utils.getRandomInt(0, CHECKS.length - 1)],
          'checkout': CHECKS[window.utils.getRandomInt(0, CHECKS.length - 1)],
          'features': FEATURES.slice(Math.floor(Math.random() * FEATURES.length)), // массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"
          'description': 'Прекрасное описания объявления ' + (i + 1), // описание объявления
          'photos': PHOTOS.slice(Math.floor(Math.random() * PHOTOS.length)) // массив строк случайной длины, содержащий адреса фотографий
        },
      };
    }
    return adverts;
  };

  createAds(ADS_NUMBER);

  window.data = {
    createAds: createAds,
    FEATURES: FEATURES,
    PHOTOS: PHOTOS,
    adverts: adverts
  };
})();

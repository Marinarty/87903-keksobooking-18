'use strict';

// функция рандома
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
// var arr = [];
// var ads = {
//   author: {},
//   offer: {},
//   location: {}
// };

var adverts = [];
var adsNumber = 8; // количество объявлений для генерации
var types = ['palace', 'flat', 'house', 'bungalo']; // тип жилья
var checks = ['12:00', '13:00', '14:00']; // часы звезда и выезда
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']; // удобства

// // функция генерации массива из объектов-объявлений
// function createAds() {

//   for (var i = 0; i < adsNumber; i++) {
//     ads.author.avatar = 'img/avatars/user0' + (i + 1) + '.png'; // аватар автора объявления

//     ads.offer.title = 'Объявление номер ' + (i + 1); // заголовок объявления
//     ads.offer.address = '600, 350';
//     ads.offer.price = 12.34;
//     ads.offer.type = types[getRandomInt(4)];
//     ads.offer.rooms = getRandomInt(5) + 1;
//     ads.offer.guests = ads.offer.rooms * 2;
//     ads.offer.checkin = checks[getRandomInt(3)];
//     ads.offer.checkout = checks[getRandomInt(3)];
//     ads.offer.features = 'массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"';
//     ads.offer.description = 'some text';
//     ads.offer.photos = 'массив строк случайной длины, содержащий адреса фотографий "http://o0.github.io/assets/images/tokyo/hotel1.jpg"';

//     ads.location.x = 'случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка';
//     ads.location.y = getRandomInt(501) + 130;

//     arr.push(ads);
//   }

//   return arr;
// }


function createAds() {

  for (var i = 0; i < adsNumber; i++) {
    adverts[i] = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png', // аватар автора объявления
      },

      'offer': {
        'title': 'Объявление номер ' + (i + 1), // заголовок объявления
        'address': '600, 350',
        'price': 12.34,
        'type': types[getRandomInt(4)],
        'rooms': getRandomInt(5) + 1,
        'guests': 2,
        'checkin': checks[getRandomInt(3)],
        'checkout': checks[getRandomInt(3)],
        'features': 'массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"',
        'description': 'some text',
        'photos': 'массив строк случайной длины, содержащий адреса фотографий "http://o0.github.io/assets/images/tokyo/hotel1.jpg"',
      },

      'location': 'случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка',
    };

    return adverts;
  };
};

console.log(createAds());

'use strict';

// функция рандома
function getRandomInt(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

// function getRandomInt(max) {
//   return Math.floor(Math.random() * Math.floor(max));
// }
// var arr = [];
// var ads = {
//   author: {},
//   offer: {},
//   location: {}
// };

var adverts = [];
var adsNumber = 8; // количество объявлений для генерации
var types = ['palace', 'flat', 'house', 'bungalo']; // тип жилья
var checks = ['12:00', '13:00', '14:00']; // часы заезда и выезда
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']; // удобства
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']; //адреса фотографий

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

// функция генерации массива из объектов-объявлений
function createAds() {

  for (var i = 0; i < adsNumber; i++) {
    adverts[i] = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png', // аватар автора объявления
      },

      'offer': {
        'title': 'Объявление номер ' + (i + 1), // заголовок объявления
        'address': '600, 350',
        'price': getRandomInt(1000, 1000000),
        'type': types[getRandomInt(0, types.length - 1)],
        'rooms': getRandomInt(1, 5),
        'guests': getRandomInt(1, 10),
        'checkin': checks[getRandomInt(0, checks.length - 1)],
        'checkout': checks[getRandomInt(0, checks.length - 1)],
        // функция возвращает массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"
        // 'features': function () {
        //   var accommodations = [];
        //   for (var j = 0; j < features.length * Math.floor(Math.random()); j++) {
        //     accommodations[j] = features[Math.floor(Math.random() * features.length)];
        //   };
        //   return accommodations;
        // },
        'features': features.slice(Math.floor(Math.random() * features.length)), // массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"
        'description': 'Прекрасное описания объявления ' + (i + 1),
        'photos': photos.slice(Math.floor(Math.random() * photos.length)), // массив строк случайной длины, содержащий адреса фотографий
      },

      'location': 'случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка',
    };
  };
  return adverts;
};

console.log(createAds());

var map = document.querySelector(".map");
map.classList.remove("map--faded");

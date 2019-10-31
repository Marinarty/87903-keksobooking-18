// модуль фильтрации объявлений
'use strict';

(function () {

  var housingTypeFilter = document.getElementById('housing-type');
  var priceFilter = document.getElementById('housing-price');
  var roomsFilter = document.getElementById('housing-rooms');
  var guestsFilter = document.getElementById('housing-guests');
  var featuresFilter = Array.from(document.querySelectorAll('.map__features input'));
  var MIN_PRICE = 0;
  var MAX_PRICE = 1000000;
  var MIDDLE_MIN_PRICE = 10000;
  var MIDDLE_MAX_PRICE = 50000;

  // фильтрация по типу жилья
  var typeValue = housingTypeFilter.value;
  housingTypeFilter.addEventListener('change', function (evt) {
    typeValue = evt.target.value;
    renderNewPins();
  });

  // фильтрация по стоимости
  var priceValue = priceFilter.value;
  priceFilter.addEventListener('change', function (evt) {
    priceValue = evt.target.value;
    renderNewPins();
  });

  // фильтрация по кол-ву комнат
  var roomsValue = roomsFilter.value;
  roomsFilter.addEventListener('change', function (evt) {
    roomsValue = evt.target.value;
    renderNewPins();
  });

  // фильтрация по кол-ву гостей
  var guestsValue = guestsFilter.value;
  guestsFilter.addEventListener('change', function (evt) {
    guestsValue = evt.target.value;
    renderNewPins();
  });

  // фильтрация по удобствам
  featuresFilter.forEach(function (elem) {
    elem.addEventListener('change', function () {
      renderNewPins();
    });
  });

  // Функция фильтрации объявления
  var getNewPins = function (response) {
    var filteredPins;

    if (typeValue === 'any') {
      filteredPins = response;
    } else {
      filteredPins = response.filter(function (elem) {
        return elem.offer.type === typeValue;
      });
    }

    if (priceValue === 'any') {
      filteredPins = filteredPins;
    } else {
      filteredPins = filteredPins.filter(function (elem) {
        if (priceValue === 'middle') {
          return elem.offer.price >= MIDDLE_MIN_PRICE && elem.offer.price < MIDDLE_MAX_PRICE;
        } else if (priceValue === 'low') {
          return elem.offer.price >= MIN_PRICE && elem.offer.price < MIDDLE_MIN_PRICE;
        }
        return elem.offer.price >= MIDDLE_MAX_PRICE && elem.offer.price < MAX_PRICE;
      });
    }

    if (roomsValue === 'any') {
      filteredPins = filteredPins;
    } else {
      filteredPins = filteredPins.filter(function (elem) {
        return elem.offer.rooms === parseInt(roomsValue, 10);
      });
    }

    if (guestsValue === 'any') {
      filteredPins = filteredPins;
    } else {
      filteredPins = filteredPins.filter(function (elem) {
        return elem.offer.guests === parseInt(guestsValue, 10);
      });
    }

    var featureValues = featuresFilter
      .filter(function (feature) {
        return feature.checked;
      })
      .map(function (feature) {
        return feature.value;
      });

    if (featureValues.length) {
      filteredPins = filteredPins.filter(function (elem) {
        return featureValues.every(function (feature) {
          return ~elem.offer.features.indexOf(feature);
        });
      });
    }

    removePins();
    mapPins.appendChild(window.pin.renderPins(filteredPins));
    onPinHundler(filteredPins);
    removePopUp();
  };

  // Устранение дребезга
  var renderNewPins = window.debounce(function () {
    getNewPins();
  });
})();

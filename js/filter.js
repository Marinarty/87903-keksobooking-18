// модуль фильтрации объявлений
'use strict';

(function () {
  var housingTypeFilter = document.querySelector('#housing-type');
  var priceFilter = document.querySelector('#housing-price');
  var roomsFilter = document.querySelector('#housing-rooms');
  var guestsFilter = document.querySelector('#housing-guests');
  var featuresFilter = Array.from(document.querySelectorAll('.map__features input'));
  var mapPins = document.querySelector('.map__pins');
  var Price = {
    MIN: 0,
    MAX: 1000000,
    MIDDLE_MIN: 10000,
    MIDDLE_MAX: 50000
  };

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

  var comparePrices = function (pinPrice, priceInSelect) {
    if (priceInSelect === 'middle') {
      return pinPrice >= Price.MIDDLE_MIN && pinPrice <= Price.MIDDLE_MAX;
    } else if (priceInSelect === 'low') {
      return pinPrice >= Price.MIN && pinPrice < Price.MIDDLE_MIN;
    }
    return pinPrice >= Price.MIDDLE_MAX && pinPrice < Price.MAX;
  };

  // Функция фильтрации объявления
  var getNewPins = function () {
    var filteredPins = window.map.response.filter(function (elem) {
      if (typeValue !== 'any' && elem.offer.type !== typeValue) {
        return false;
      }

      if (priceValue !== 'any' && !comparePrices(elem.offer.price, priceValue)) {
        return false;
      }

      if (roomsValue !== 'any' && elem.offer.rooms !== parseInt(roomsValue, 10)) {
        return false;
      }

      if (guestsValue !== 'any' && elem.offer.guests !== parseInt(guestsValue, 10)) {
        return false;
      }

      var featureValues = featuresFilter
      .filter(function (feature) {
        return feature.checked;
      })
      .map(function (feature) {
        return feature.value;
      });

      if (featureValues.length) {
        return featureValues.every(function (feature) {
          return ~elem.offer.features.indexOf(feature);
        });
      }
      return true;
    });

    window.map.removePins();
    mapPins.appendChild(window.pin.renderPins(filteredPins));
    window.map.pinClickHandler(filteredPins);
    window.map.removePopUp();
  };

  // Устранение дребезга
  var renderNewPins = window.debounce(function () {
    getNewPins();
  });
})();

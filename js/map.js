// модуль, работающий с картой
'use strict';

(function () {
  var map = document.querySelector('.map');
  var formElements = document.querySelectorAll('.notice fieldset');
  var mainPin = document.querySelector('.map__pin--main');
  var mainForm = document.querySelector('.ad-form');
  var mapPins = document.querySelector('.map__pins');
  var addressInput = document.getElementById('address');
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_POINT_HEIGHT = 22; // высота острого конца метки
  var MAP_Y_MIN = 130; // минимальная кордината метки по Y
  var MAP_Y_MAX = 630; // максимальная кордината метки по Y
  var mainPinDefaultCoords = {
    x: mainPin.style.left,
    y: mainPin.style.top
  };
  var housingTypeFilter = document.getElementById('housing-type');
  var priceFilter = document.getElementById('housing-price');
  var roomsFilter = document.getElementById('housing-rooms');
  var guestsFilter = document.getElementById('housing-guests');
  var featuresFilter = Array.from(document.querySelectorAll('.map__features input'));
  var popUp = document.querySelector('.popup');

  // делаем элементы управления формы неактивными
  for (var i = 0; i < formElements.length; i++) {
    formElements[i].setAttribute('disabled', 'disabled');
  }

  // функция удаления попапа
  var removePopUp = function () {
    if (popUp) {
      popUp.remove();
    }
  };

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

  // в активное состояние карты
  var toActive = function (response) {
    map.classList.remove('map--faded');
    mainForm.classList.remove('ad-form--disabled');
    fillAddressForActiveMap(mainPin);
    mapPins.appendChild(window.pin.renderPins(response));

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
    var getNewPins = function () {
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
            return elem.offer.price >= 10000 && elem.offer.price < 50000;
          } else if (priceValue === 'low') {
            return elem.offer.price >= 0 && elem.offer.price < 10000;
          }
          return elem.offer.price >= 50000 && elem.offer.price < 1000000;
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

      // var popUp = document.querySelector('.popup');
      // if (popUp) {
      //   popUp.remove();
      // }
      removePopUp();
    };

    // Устранение дребезга
    var renderNewPins = window.debounce(function () {
      getNewPins();
    });

    for (var k = 0; k < formElements.length; k++) {
      formElements[k].removeAttribute('disabled', 'disabled');
    }

    var mapPin = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var j = 0; j < mapPin.length; j++) {
      mapPin[j].addEventListener('click', function (evt) {
        var popUp = document.querySelector('.popup');
        if (popUp) {
          popUp.remove();
        }
        var dataId;
        if (evt.target.tagName === 'BUTTON') {
          dataId = evt.target.getAttribute('data-id');
        } else {
          dataId = evt.target.parentNode.getAttribute('data-id');
        }

        document.querySelector('.map').insertBefore(window.card.createPopup(response[dataId]), document.querySelector('.map__filters-container'));
        var popupClose = document.querySelector('.popup__close');
        popupClose.addEventListener('click', function () {
          popUp = document.querySelector('.popup');
          popUp.remove();
        });
        popupClose.addEventListener('keydown', function (evt) {
          if (evt.keyCode === window.utils.ESCAPE_KEYCODE) {
            popUp = document.querySelector('.popup');
            popUp.remove();
          };
        });
      });
    }
  };

  // в НЕактивное состояние карты
  var toInactive = function () {
    mainPin.style.left = mainPinDefaultCoords.x;
    mainPin.style.top = mainPinDefaultCoords.y;
    fillAddressForInactiveMap(mainPin);
    mainForm.classList.add('ad-form--disabled');

    for (var s = 0; s < formElements.length; s++) {
      formElements[s].setAttribute('disabled', 'disabled');
    }
  };

  mainForm.addEventListener('submit', function (evt) {
    window.upload(new FormData(mainForm), successHandler, window.messages.errorHundler);
    evt.preventDefault();
  });

  var removePins = function () {
    var mapPin = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var l = 0; l < mapPin.length; l++) {
      mapPin[l].remove();
    }
  };

  var successHandler = function () {
    window.messages.successMessage();
    mainForm.reset();
    toInactive();
    removePins();
    var popUp = document.querySelector('.popup');
    if (popUp) {
      popUp.remove();
    }
  };

  // возврат в исходное состояние по кнопке сброса
  var resetPage = document.querySelector('.ad-form__reset');
  resetPage.addEventListener('click', function () {
    toInactive();
  });

  // добавляем в инпут адреса координаты острого конца метки при перемещении метки
  var fillAddressForChangingCoords = function (element) {
    addressInput.value = Math.round(element.offsetLeft + element.offsetWidth / 2) + ', ' + (Math.round(element.offsetTop + element.offsetHeight + MAIN_PIN_POINT_HEIGHT));
  };

  // ограничиваем координату Х, если она выпадает за пределы  блока map__pins
  var catchXCoord = function (x) {
    var start = mapPins.offsetLeft - mainPin.offsetWidth / 2;
    var end = mapPins.offsetLeft + mapPins.offsetWidth - mainPin.offsetWidth / 2;

    if (x < start) {
      return start;
    }
    if (x > end) {
      return end;
    }
    return x;
  };

  // ограничиваем координату Y, если она выпадает за пределы  блока map__pins
  var catchYCoord = function (y) {
    var start = mapPins.offsetTop + MAP_Y_MIN - mainPin.offsetHeight - MAIN_PIN_POINT_HEIGHT;
    var end = mapPins.offsetTop + MAP_Y_MAX - mainPin.offsetHeight - MAIN_PIN_POINT_HEIGHT;
    if (y < start) {
      return start;
    }
    if (y > end) {
      return end;
    }
    return y;
  };

  // добавляем обработчик события mousedown на элемент .map__pin--main, переводящий страницу из неактивного состояния в активное и следит за перемещением главного пина
  var counter = 0;
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    if (!counter) {
      window.load('https://js.dump.academy/keksobooking/data', toActive, window.messages.errorHundler);
      counter++;
    }

    var startCoords = {
      x: mainPin.offsetLeft,
      y: mainPin.offsetTop
    };

    var startClientCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startClientCoords.x - moveEvt.clientX,
        y: startClientCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: startCoords.x - shift.x,
        y: startCoords.y - shift.y
      };

      startClientCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      mainPin.style.left = catchXCoord(startCoords.x) + 'px';
      mainPin.style.top = catchYCoord(startCoords.y) + 'px';

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      fillAddressForChangingCoords(mainPin);

    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

  mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.utils.ENTER_KEYCODE) {
      toActive();
    }
  });

  window.map = {
    toActive: toActive
  };
})();

// модуль, работающий с картой
'use strict';

(function () {
  var map = document.querySelector('.map');
  var formElements = document.querySelectorAll('.map__filter');
  var mainPin = document.querySelector('.map__pin--main');
  var mainForm = document.querySelector('.ad-form');
  var mapPins = document.querySelector('.map__pins');
  var addressInput = document.getElementById('address');
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_POINT_HEIGHT = 22; // высота острого конца метки
  var MAP_Y_MIN = 130; // минимальная кордината метки по Y
  var MAP_Y_MAX = 630; // максимальгая кордината метки по Y

  // делаем элементы управления формы неактивными
  for (var i = 0; i < formElements.length; i++) {
    formElements[i].setAttribute('disabled', 'disabled');
  }

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
    mapPins.appendChild(window.pin.fragment);

    for (var k = 0; k < formElements.length; k++) {
      formElements[k].removeAttribute('disabled', 'disabled');
    }

    var mapPin = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var j = 0; j < mapPin.length; j++) {
      mapPin[j].addEventListener('click', function (evt) {

        var dataId = evt.target.parentNode.getAttribute('data-id');
        document.querySelector('.map').insertBefore(window.card.createPopup(window.data.adverts[dataId]), document.querySelector('.map__filters-container'));
        var popUp = document.querySelectorAll('.popup');
        var popupClose = document.querySelectorAll('.popup__close');

        for (var p = 0; p < popupClose.length; p++) {
          popupClose[p].addEventListener('click', function () {

            for (var z = 0; z < popUp.length; z++) {
              popUp[z].remove();
            }
          });
        }
      });
    }
  };

  // добавляем в инпут адреса координаты острого конца метки при перемещении метки
  var fillAddressForChangingCoords = function (element) {
    addressInput.value = Math.round(element.offsetLeft + element.offsetWidth / 2) + ', ' + (Math.round(element.offsetTop + element.offsetHeight + MAIN_PIN_POINT_HEIGHT));
  };

  // ограничиваем координату Х, если она выпадает за пределы  блока map__pins
  var catchXCoord = function (x) {
    var start = mapPins.offsetLeft - mainPin.offsetWidth / 2;
    var end = mapPins.offsetLeft + mapPins.offsetWidth - mainPin.offsetWidth / 2; // почему нет offsetRight?

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
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    toActive();

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
})();

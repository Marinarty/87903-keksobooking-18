// модуль, работающий с картой
'use strict';

(function () {
  var map = document.querySelector('.map');
  var formElements = document.querySelectorAll('.notice fieldset');
  var mainPin = document.querySelector('.map__pin--main');
  var mainForm = document.querySelector('.ad-form');
  var mapPins = document.querySelector('.map__pins');
  var addressInput = document.querySelector('#address');
  var resetPage = document.querySelector('.ad-form__reset');
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_POINT_HEIGHT = 22; // высота острого конца метки
  var MAP_Y_MIN = 130; // минимальная кордината метки по Y
  var MAP_Y_MAX = 630; // максимальная кордината метки по Y
  var mainPinDefaultCoords = {
    x: mainPin.style.left,
    y: mainPin.style.top
  };
  var counter = 0;

  // функция деактивации элемента
  var toDisabled = function () {
    for (var i = 0; i < formElements.length; i++) {
      formElements[i].setAttribute('disabled', 'disabled');
    }
  };

  toDisabled();

  // функция удаления попапа
  var removePopUp = function () {
    var popUp = document.querySelector('.popup');
    if (popUp) {
      popUp.remove();
    }
    document.removeEventListener('keydown', popUpCloseHandler);
  };

  var popUpCloseHandler = function (evt) {
    if (evt.keyCode === window.utils.ESCAPE_KEYCODE) {
      removePopUp();
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

  var pinClickHandler = function (filteredPins) {
    var mapPin = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var j = 0; j < mapPin.length; j++) {
      mapPin[j].addEventListener('click', function (evt) {
        removePopUp();
        var dataId = evt.currentTarget.getAttribute('data-id');
        document.addEventListener('keydown', popUpCloseHandler);
        map.insertBefore(window.card.createPopup(filteredPins[dataId]), document.querySelector('.map__filters-container'));
      });
    }
  };

  // в активное состояние карты
  var toActive = function (response) {
    response = response.filter(function (elem) {
      return elem.hasOwnProperty('offer');
    });

    window.map.response = response;

    map.classList.remove('map--faded');
    mainForm.classList.remove('ad-form--disabled');
    fillAddressForActiveMap(mainPin);
    mapPins.appendChild(window.pin.renderPins(response));
    for (var k = 0; k < formElements.length; k++) {
      formElements[k].removeAttribute('disabled', 'disabled');
    }
    pinClickHandler(response);
  };

  // в НЕактивное состояние карты
  var toInactive = function () {
    counter = 0;
    map.classList.add('map--faded');
    mainPin.style.left = mainPinDefaultCoords.x;
    mainPin.style.top = mainPinDefaultCoords.y;
    fillAddressForInactiveMap(mainPin);
    mainForm.classList.add('ad-form--disabled');
    toDisabled();
  };

  mainForm.addEventListener('submit', function (evt) {
    window.upload(new FormData(mainForm), getSuccess, window.messages.errorMessage);
    evt.preventDefault();
  });

  var removePins = function () {
    var mapPin = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var l = 0; l < mapPin.length; l++) {
      mapPin[l].remove();
    }
  };

  var getSuccess = function () {
    window.messages.successMessage();
    mainForm.reset();
    toInactive();
    removePins();
    removePopUp();
  };

  // возврат в исходное состояние по кнопке сброса
  resetPage.addEventListener('click', function () {
    toInactive();
  });

  // добавляем в инпут адреса координаты острого конца метки при перемещении метки
  var fillAddressForChangingCoords = function (element) {
    addressInput.value = Math.round(element.offsetLeft + element.offsetWidth / 2) + ', ' + (Math.round(element.offsetTop + element.offsetHeight + MAIN_PIN_POINT_HEIGHT));
  };

  // ограничиваем координату Х, если она выпадает за пределы блока map__pins
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
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    if (!counter) {
      window.load(toActive, window.messages.errorMessage);
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
    toActive: toActive,
    removePopUp: removePopUp,
    removePins: removePins,
    pinClickHandler: pinClickHandler,
  };
})();

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
  var MAIN_PIN_POINT_HEIGHT = 22;
  var fragment = document.createDocumentFragment(); // пришлось продублировать !!!!!!!!!!!!!


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
    mapPins.appendChild(fragment);

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

  // добавляем обработчик события click на элемент .map__pin--main, переводящий страницу из неактивного состояния в активное
  mainPin.addEventListener('click', function () {
    toActive();
  });

  mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.utils.ENTER_KEYCODE) {
      toActive();
    }
  });
})();

// модуль, работающий с формой
'use strict';

(function () {
  var inputRooms = document.querySelector('#room_number');
  var inputCapacity = document.querySelector('#capacity');
  var adTitleInput = document.querySelector('#title');
  var adPriceInput = document.querySelector('#price');
  var adTypeSelect = document.querySelector('#type');
  var adTimeInSelect = document.querySelector('#timein');
  var adTimeOutSelect = document.querySelector('#timeout');

  // сверка гостей и комнат
  var roomsGuests = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  var TypePrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  inputRooms.addEventListener('change', function () {
    var currentValue = inputRooms.value;
    var roomsGuestsValue = roomsGuests[currentValue];

    for (var i = 0; i < inputCapacity.options.length; i++) {
      var option = inputCapacity.options[i];
      option.disabled = true;

      for (var j = 0; j < roomsGuestsValue.length; j++) {
        if (roomsGuestsValue[j] === Number(option.value)) {
          option.disabled = false;
        }
      }
    }
  });

  // валидация формы
  adTitleInput.addEventListener('input', function () {
    if (adTitleInput.validity.tooShort) {
      adTitleInput.setCustomValidity('Должно состоять минимум из 30 символов');
    } else if (adTitleInput.validity.tooLong) {
      adTitleInput.setCustomValidity('Не должно превышать 100 символов');
    } else if (adTitleInput.validity.valueMissing) {
      adTitleInput.setCustomValidity('Обязательно для заполнения');
    } else {
      adTitleInput.setCustomValidity('');
    }
  });

  adPriceInput.addEventListener('input', function () {
    if (adPriceInput.validity.rangeOverflow) {
      adPriceInput.setCustomValidity('Цена за ночь не должна превышать 1 000 000 рублей');
    } else if (adPriceInput.validity.rangeUnderflow) {
      adPriceInput.setCustomValidity('Цена за ночь не может быть менее 0 рублей');
    } else if (adPriceInput.validity.valueMissing) {
      adPriceInput.setCustomValidity('Обязательно для заполнения');
    } else {
      adPriceInput.setCustomValidity('');
    }
  });

  var checkTimeInOut = function (timeFirst, timeSecond) {
    timeSecond.value = timeFirst.value;
  };

  adTypeSelect.addEventListener('change', function () {
    var currentValue = adTypeSelect.value;
    var currentPrice = TypePrice[currentValue.toUpperCase()];
    adPriceInput.min = currentPrice;
    adPriceInput.placeholder = currentPrice;
  });

  adTimeInSelect.addEventListener('change', function () {
    checkTimeInOut(adTimeInSelect, adTimeOutSelect);
  });

  adTimeOutSelect.addEventListener('change', function () {
    checkTimeInOut(adTimeOutSelect, adTimeInSelect);
  });
})();

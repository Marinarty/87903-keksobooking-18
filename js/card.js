// модуль, создающий карточку объявления
'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var getRoomsType = function (type) {
    if (type === 'flat') {
      return 'Квартира';
    } else if (type === 'bungalo') {
      return 'Бунгало';
    } else if (type === 'house') {
      return 'Дом';
    }
    return 'Дворец';
  };

  var createFeatures = function (fts) {
    var featureElement = '';

    for (var j = 0; j < fts.length; j++) {
      featureElement += '<li class="popup__feature popup__feature--' + fts[j] + '"></li>';
    }
    return featureElement;
  };

  var createPhotos = function (photo) {
    var photoElement = '';

    for (var j = 0; j < photo.length; j++) {
      photoElement += '<img src="' + photo[j] + '"' + 'class="popup__photo" width="45" height="40" alt="Фотография жилья"></img>';
    }
    return photoElement;
  };

  // создание карточки объявления
  var createPopup = function (popup) {
    var popupElement = cardTemplate.cloneNode(true);
    popupElement.querySelector('.popup__title').textContent = popup.offer.title;
    popupElement.querySelector('.popup__text--address').textContent = popup.offer.address;
    popupElement.querySelector('.popup__text--price').textContent = popup.offer.price + ' ₽/ночь';
    popupElement.querySelector('.popup__type').textContent = getRoomsType(popup.offer.type);
    popupElement.querySelector('.popup__text--capacity').textContent = popup.offer.rooms + ' комнаты для ' + popup.offer.guests + ' гостей.';
    popupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + popup.offer.checkin + ', выезд до ' + popup.offer.checkout;
    popupElement.querySelector('.popup__features').innerHTML = createFeatures(popup.offer.features);
    popupElement.querySelector('.popup__description').textContent = popup.offer.description;
    popupElement.querySelector('.popup__photos').innerHTML = createPhotos(popup.offer.photos);
    popupElement.querySelector('.popup__avatar').src = popup.author.avatar;
    return popupElement;
  };

  window.card = {
    createPopup: createPopup
  };

})();

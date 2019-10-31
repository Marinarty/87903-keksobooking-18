// модуль, создающий и отрисовывающий пин
'use strict';

(function () {
  var MAX_PINS = 5;
  // создаю пин
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var createPin = function (ads, id) {
    var adsElement = pinTemplate.cloneNode(true);
    adsElement.style.left = ads.location.x + 'px';
    adsElement.style.top = ads.location.y + 'px';
    adsElement.querySelector('img').src = ads.author.avatar;
    adsElement.querySelector('img').alt = ads.offer.title;
    adsElement.setAttribute('data-id', id);
    return adsElement;
  };

  var renderPins = function (response) {
    var fragment = document.createDocumentFragment();

    // вывожу пин
    var pinsNumber = response.length > MAX_PINS ? MAX_PINS : response.length;
    for (var i = 0; i < pinsNumber; i++) {
      fragment.appendChild(createPin(response[i], i));
    }
    return fragment;
  };

  window.pin = {
    renderPins: renderPins
  };
})();

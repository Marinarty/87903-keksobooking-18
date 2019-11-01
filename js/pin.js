// модуль, создающий и отрисовывающий пин
'use strict';

(function () {
  var MAX_PINS = 5;
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // создаю пин
  var createPin = function (ads, id) {
    var adsElement = pinTemplate.cloneNode(true);
    var adsElementImg = adsElement.querySelector('img');
    adsElement.style.left = ads.location.x + 'px';
    adsElement.style.top = ads.location.y + 'px';
    adsElementImg.src = ads.author.avatar;
    adsElementImg.alt = ads.offer.title;
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

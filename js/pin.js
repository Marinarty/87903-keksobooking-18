// модуль, создающий и отрисовывающий пин
'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();

  // создаю пин
  var createPins = function (ads, id) {
    var adsElement = pinTemplate.cloneNode(true);
    adsElement.style.left = ads.location.x + 'px';
    adsElement.style.top = ads.location.y + 'px';
    adsElement.querySelector('img').src = ads.author.avatar;
    adsElement.querySelector('img').alt = ads.offer.title;
    adsElement.setAttribute('data-id', id);
    return adsElement;
  };

  // вывожу пин
  for (var i = 0; i < window.data.adverts.length; i++) {
    fragment.appendChild(createPins(window.data.adverts[i], i));
  }

  window.pin = {
    fragment: fragment
  };
})();

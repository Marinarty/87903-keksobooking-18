// модуль сообщений об успехе и провале

'use strict';

(function () {
  // отрисовка сообщения об ошибке при провале

  var errorHundler = function () {
    var main = document.querySelector('main');
    var errorTemplateId = document.querySelector('#error');
    var errorTemplate = errorTemplateId.content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);
    main.appendChild(errorElement);
  };

  // var errorButton = document.querySelector('.error__button');

  // errorButton.addEventListener('keydown', function (evt) {
  //   if (evt.keyCode === window.utils.ESCAPE_KEYCODE) {
  //     errorElement.remove();
  //   }
  // });

  window.messages = {
    errorHundler: errorHundler
  };
})();

// модуль сообщений об успехе и провале

'use strict';

(function () {
  // отрисовка сообщения об ошибке при провале
  var main = document.querySelector('main');

  var errorHundler = function () {
    var errorTemplateId = document.querySelector('#error');
    var errorTemplate = errorTemplateId.content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);
    main.appendChild(errorElement);

    // var errorButton = document.querySelector('.error__button');

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.utils.ESCAPE_KEYCODE) {
        errorElement.remove();
      }
    });

    errorElement.addEventListener('click', function () {
        errorElement.remove();
    });
  };

  var successMessage = function () {
    var successTemplateId = document.querySelector('#success');
    var successTemplate = successTemplateId.content.querySelector('.success');
    var successMessage = successTemplate.cloneNode(true);
    main.appendChild(successMessage);
  };

  window.messages = {
    errorHundler: errorHundler,
    successMessage: successMessage
  };
})();

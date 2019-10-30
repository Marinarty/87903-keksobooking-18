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

    // document.addEventListener('keydown', closeErrorMessageHundler);
    // var closeErrorMessageHundler = function (evt) {
    //   if (evt.keyCode === window.utils.ESCAPE_KEYCODE) {
    //     errorElement.remove();
    //     console.log('error')
    //   }
    // };
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.utils.ESCAPE_KEYCODE) {
        errorElement.remove();
      }
    });

    errorElement.addEventListener('click', function () {
      errorElement.remove();
    });

    // document.removeEventListener('keydown', closeErrorMessageHundler);
  };

  var successMessage = function () {
    var successTemplateId = document.querySelector('#success');
    var successTemplate = successTemplateId.content.querySelector('.success');
    var successNotice = successTemplate.cloneNode(true);
    main.appendChild(successNotice);

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.utils.ESCAPE_KEYCODE) {
        successNotice.remove();
      }
    });

    successNotice.addEventListener('click', function () {
      successNotice.remove();
    });
  };

  window.messages = {
    errorHundler: errorHundler,
    successMessage: successMessage
  };
})();

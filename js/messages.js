// модуль сообщений об успехе и провале
'use strict';

(function () {
  var main = document.querySelector('main');

  var createMessage = function (id) {
    var messageTemplateId = document.getElementById(id);
    var messageTemplate = messageTemplateId.content.querySelector('.' + id);
    var messageElement = messageTemplate.cloneNode(true);
    main.appendChild(messageElement);

    messageElement.addEventListener('click', function () {
      messageElement.remove();
    });

    var closeMessageHundler = function (evt) {
      if (evt.keyCode === window.utils.ESCAPE_KEYCODE) {
        messageElement.remove();
      }
      document.removeEventListener('keydown', closeMessageHundler);
    };
    document.addEventListener('keydown', closeMessageHundler);
  };

  var errorHundler = function () {
    createMessage('error');
  };

  var successMessage = function () {
    createMessage('success');
  };

  window.messages = {
    errorHundler: errorHundler,
    successMessage: successMessage
  };
})();

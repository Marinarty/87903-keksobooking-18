// модуль сообщений об успехе и провале
'use strict';

(function () {
  var main = document.querySelector('main');

  var createMessage = function (id) {
    var messageTemplateId = document.querySelector('#' + id);
    var messageTemplate = messageTemplateId.content.querySelector('.' + id);
    var messageElement = messageTemplate.cloneNode(true);
    main.appendChild(messageElement);

    messageElement.addEventListener('click', function () {
      messageElement.remove();
    });

    var messageCloseHandler = function (evt) {
      if (evt.keyCode === window.utils.ESCAPE_KEYCODE) {
        messageElement.remove();
        document.removeEventListener('keydown', messageCloseHandler);
      }
    };
    document.addEventListener('keydown', messageCloseHandler);
  };

  var errorMessage = function () {
    createMessage('error');
  };

  var successMessage = function () {
    createMessage('success');
  };

  window.messages = {
    errorMessage: errorMessage,
    successMessage: successMessage
  };
})();

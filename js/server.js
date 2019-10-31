// модуль работы с сервером
'use strict';

(function () {
  var Url = {
    GET: 'https://js.dump.academy/keksobooking/data',
    POST: 'https://js.dump.academy/keksobooking'
  };

  var treatData = function (type, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    xhr.open(type, Url[type]);
    xhr.send(data);
  };

  // загрузка данных
  window.load = function (onSuccess, onError) {
    treatData('GET', onSuccess, onError);
  };

  // отправка данных
  window.upload = function (data, onSuccess, onError) {
    treatData('POST', onSuccess, onError, data);
  };
})();

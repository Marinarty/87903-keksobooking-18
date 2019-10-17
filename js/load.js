// модуль загрузки данных
'use strict';

(function () {
  window.load = function (url, onSuccess, onError) {
    // var url = 'https://js.dump.academy/keksobooking/data';

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

    xhr.open('GET', url);
    xhr.send();
  }
})();


var successHundler = function (response) {
  // отрисовка пинов при успехе
window.map.toActive(response);
  console.log('sc')
}

var errorHundler = function () {

  console.log('er');
  // отрисовка сообщения об ошибке при провале
  var main = document.querySelector('main');
  var errorTemplate = document.querySelector('#error');
  var errorMessage = errorTemplate.cloneNode(true);
  main.appendChild(errorMessage);


}

// window.load('https://js.dump.academy/keksobooking/data', successHundler, errorHundler)

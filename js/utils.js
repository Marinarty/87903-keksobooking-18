// модуль с полезностями
'use strict';

(function () {
  // функция рандома
  var getRandomInt = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  };

  var ENTER_KEYCODE = 13;

  window.utils = {
    getRandomInt: getRandomInt,
    ENTER_KEYCODE: ENTER_KEYCODE
  };
})();

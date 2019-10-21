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
  var ESCAPE_KEYCODE = 27;

  window.utils = {
    getRandomInt: getRandomInt,
    ENTER_KEYCODE: ENTER_KEYCODE,
    ESCAPE_KEYCODE: ESCAPE_KEYCODE
  };
})();

/**
 * PokemonGo-Bot-Desktop | Utils.js
 *
 * @author Kelvin De Moya <http://github.com/kdemoya>.
 */
'use strict';

module.exports = {
  pad_with_zeroes: function (number, length) {
    var my_string = '' + number;

    while (my_string.length < length) {
      my_string = '0' + my_string;
    }

    return my_string;
  }
};

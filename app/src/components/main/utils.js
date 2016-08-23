'use strict';

modules.export = {
    pad_with_zeroes: function (number, length) {
        var my_string = '' + number;

        while (my_string.length < length) {
            my_string = '0' + my_string;
        }

        return my_string;
    }
};

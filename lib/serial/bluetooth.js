/// <reference path="../typings/tsd.d.ts"/>
var OBD2;
(function (OBD2) {
    var Serial;
    (function (Serial) {
        var Bluetooth = (function () {
            function Bluetooth(port, options) {
            }
            return Bluetooth;
        })();
        Serial.Bluetooth = Bluetooth;
    })(Serial = OBD2.Serial || (OBD2.Serial = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

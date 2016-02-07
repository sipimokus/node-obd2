/// <reference path="../typings/main.d.ts"/>
/// <reference path="bluetooth.ts"/>
/// <reference path="fake.ts"/>
/// <reference path="usb.ts"/>
var _blueTooth = require("./bluetooth");
var _fakeSerial = require("./fake");
var _usbSerial = require("./usb");
var debug = require("debug")("OBD2.Serial.Main");
var OBD2;
(function (OBD2) {
    var Serial;
    (function (Serial) {
        var Main = (function () {
            /**
             * Serial declare
             *
             * @param type
             * @returns {any}
             */
            function Main(type, port, options) {
                debug("Serial type: " + type);
                debug("Serial port: " + port);
                this.Serial = this.selectSerial(type, port, options);
                if (!this.Serial) {
                    throw new Error("Unknown connection type: " + type);
                }
                return this.Serial;
            }
            Main.prototype.getSerialInstance = function () {
                return this.Serial;
            };
            /**
             * Connection class selector
             *
             * @param type
             * @param port
             * @param options
             * @returns {any}
             */
            Main.prototype.selectSerial = function (type, port, options) {
                switch (type.toLowerCase()) {
                    case "bt":
                    case "bluetooth":
                        return new _blueTooth.OBD2.Serial.Bluetooth(port, options);
                        break;
                    case "fake":
                    case "fakeserial":
                        return new _fakeSerial.OBD2.Serial.Fake(port, options);
                        break;
                    case "usb":
                    case "serial":
                        return new _usbSerial.OBD2.Serial.Usb(port, options);
                        break;
                    default:
                        return undefined;
                }
            };
            return Main;
        })();
        Serial.Main = Main;
    })(Serial = OBD2.Serial || (OBD2.Serial = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

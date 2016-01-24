/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="bluetooth.ts"/>
/// <reference path="fake.ts"/>
/// <reference path="usb.ts"/>
var _bluetooth = require("./bluetooth");
var _fakeserial = require("./fake");
var _usbserial = require("./usb");
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
            function Main(type) {
                var _this = this;
                /**
                 * Events handler
                 *
                 * @private
                 */
                this._eventsHandler = function () {
                    _this.Serial.on("ready", function () {
                        debug("Serial port ready");
                    });
                    _this.Serial.on("open", function (port) {
                        debug("Serial port opened: " + port);
                    });
                    _this.Serial.on("close", function (port) {
                        debug("Serial port closed: " + port);
                    });
                    _this.Serial.on("error", function (error, port) {
                        debug("Serial port error: " + port);
                    });
                    _this.Serial.on("data", function (data, port) {
                        debug("Serial port data: " + data);
                    });
                };
                debug("Serial type: " + type);
                this.Serial = this.selectSerial(type);
                if (!this.Serial) {
                    throw new Error("Unknown connection type: " + type);
                }
                this._eventsHandler();
                return this.Serial;
            }
            /**
             * Connection class selector
             *
             * @param type
             * @returns {any}
             */
            Main.prototype.selectSerial = function (type) {
                switch (type.toLowerCase()) {
                    case 'bt':
                    case 'bluetooth':
                        return new _bluetooth.OBD2.Serial.Bluetooth();
                        break;
                    case 'fake':
                    case 'fakeserial':
                        return new _fakeserial.OBD2.Serial.Fake();
                        break;
                    case 'usb':
                    case 'serial':
                        return new _usbserial.OBD2.Serial.Usb();
                        break;
                }
                return null;
            };
            return Main;
        })();
        Serial.Main = Main;
    })(Serial = OBD2.Serial || (OBD2.Serial = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

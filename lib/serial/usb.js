/// <reference path="../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SerialPort = require("serialport");
var baseSerial = require("./base");
var OBD2;
(function (OBD2) {
    var Serial;
    (function (Serial) {
        var Usb = (function (_super) {
            __extends(Usb, _super);
            /**
             * Constructor
             *
             * @param port
             * @param options
             */
            function Usb(port, options) {
                var _this = _super.call(this) || this;
                _this.setPort(port);
                _this.setOptions(options);
                _this.setSerial(new SerialPort(port, options));
                return _this;
            }
            return Usb;
        }(baseSerial.OBD2.Serial.Base));
        Serial.Usb = Usb;
    })(Serial = OBD2.Serial || (OBD2.Serial = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

/// <reference path="../typings/index.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SerialPort = (require("../core/fakeserial")).OBD2.Core.FakeSerial;
var baseSerial = require("./base");
var OBD2;
(function (OBD2) {
    var Serial;
    (function (Serial) {
        var Fake = (function (_super) {
            __extends(Fake, _super);
            /**
             * Constructor
             *
             * @param port
             * @param options
             */
            function Fake(port, options) {
                _super.call(this);
                this.setPort(port);
                this.setOptions(options);
                this.setSerial(new SerialPort(port, options, false));
            }
            return Fake;
        }(baseSerial.OBD2.Serial.Base));
        Serial.Fake = Fake;
    })(Serial = OBD2.Serial || (OBD2.Serial = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

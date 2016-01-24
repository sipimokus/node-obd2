/// <reference path="../typings/tsd.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SerialPort = require('serialport').SerialPort;
var events = require('events');
var OBD2;
(function (OBD2) {
    var Serial;
    (function (Serial) {
        var Usb = (function (_super) {
            __extends(Usb, _super);
            function Usb() {
                _super.call(this);
            }
            Usb.prototype.connect = function (port, options) {
                this.port = port;
                this.options = options;
                this.Serial = new SerialPort(this.port, this.options);
                this._eventHandler();
                this.emit('ready');
            };
            Usb.prototype.disconnect = function () {
                this.Serial.close();
            };
            Usb.prototype.write = function (data) {
                if (this.Serial.isOpen()) {
                    try {
                        this.Serial.write(data);
                    }
                    catch (err) {
                        console.log('Error while writing: ' + err);
                    }
                }
            };
            Usb.prototype.read = function () {
            };
            Usb.prototype._eventHandler = function () {
                var _this = this;
                this.Serial.on('open', function () {
                    _this.emit('open', _this.port);
                });
                this.Serial.on('close', function () {
                    _this.emit('close', _this.port);
                });
                this.Serial.on('error', function (error) {
                    _this.emit('close');
                    _this.emit('error', error, _this.port);
                });
                this.Serial.on('data', function (data) {
                    _this.emit('data', data, _this.port);
                });
            };
            return Usb;
        })(events.EventEmitter);
        Serial.Usb = Usb;
    })(Serial = OBD2.Serial || (OBD2.Serial = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

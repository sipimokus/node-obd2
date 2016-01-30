/// <reference path="../typings/tsd.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SerialPort = (require('../core/fakeserial')).OBD2.Core.FakeSerial;
var events = require('events');
var OBD2;
(function (OBD2) {
    var Serial;
    (function (Serial) {
        var Fake = (function (_super) {
            __extends(Fake, _super);
            function Fake() {
                _super.call(this);
            }
            Fake.prototype.connect = function (port, options) {
                this.port = port;
                this.options = options;
                this.Serial = new SerialPort(this.port, this.options);
                //this.Serial = new (require('../../fakeserial'))();
                //this.Serial = new (require('../core/fakeserial'))();
                this._eventHandler();
                this.emit('ready');
            };
            Fake.prototype.disconnect = function () {
                this.Serial.close();
            };
            Fake.prototype.write = function (data) {
                try {
                    this.Serial.write(data);
                }
                catch (err) {
                    console.log('Error while writing: ' + err);
                }
            };
            Fake.prototype.read = function () {
            };
            Fake.prototype._eventHandler = function () {
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
            return Fake;
        })(events.EventEmitter);
        Serial.Fake = Fake;
    })(Serial = OBD2.Serial || (OBD2.Serial = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

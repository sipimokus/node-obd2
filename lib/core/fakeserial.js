/**
 * OBD protocol emulated serial port
 *
 * Source and inspiring:
 * https://github.com/matejkramny/nodejs-obd-parser
 *
 */
/// <reference path="../typings/tsd.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var util = require('util');
var events = require('events');
var commands = [];
require('fs').readdirSync(__dirname + '/../data/pid').forEach(function (e) {
    commands.push(require(__dirname + '/../data/pid/' + e));
});
var debug = require("debug")("OBD2.Core.FakeSerial");
var OBD2;
(function (OBD2) {
    var Core;
    (function (Core) {
        var FakeSerial = (function (_super) {
            __extends(FakeSerial, _super);
            function FakeSerial(fakePort, fakeOptions, openImmediately) {
                var _this = this;
                _super.call(this);
                this.opened = false;
                this.modes = {
                    L: 1,
                    E: 1
                };
                this.isOpen = function () {
                    return _this.opened;
                };
                this.writeNext = function (data) {
                    process.nextTick(function () {
                        _this.emit('data', data + "\r\r");
                    });
                };
                this.drain = function (data) {
                    _this.write(data);
                };
                this.write = function (data) {
                    data = data.replace("\n", "").replace("\r", "");
                    if (data.substring(0, 2) == "AT") {
                        var mode = data.substring(3, 4);
                        for (var m in _this.modes) {
                            if (mode == m) {
                                _this.modes[m] = 0;
                                if (data.substring(4, 5) == "1") {
                                    _this.modes[m] = 1;
                                }
                            }
                        }
                    }
                    if (_this.modes.E) {
                    }
                    if (data == "AT E0") {
                        _this.writeNext(data);
                        return;
                    }
                    if (data == "0100" || data == "0120" || data == "0140" || data == "0160" || data == "0180" || data == "01A0" || data == "01C0") 
                    //if (data == "0100" || data == "0120")
                    {
                        return _this.findSupportedPins(data);
                    }
                    if (data.substring(0, 2) != "01") {
                        return _this.writeNext('?');
                    }
                    var cmd = data.substring(2, 4);
                    for (var i = 0; i < commands.length; i++) {
                        if (commands[i].pid == cmd) {
                            if (typeof commands[i].testResponse == "function") {
                                var res = commands[i].testResponse(data).toString(16);
                                if (res.length % 2 == 1) {
                                    res = '0' + res;
                                }
                                return _this.writeNext(('>41' + cmd + '' + res).toUpperCase());
                            }
                        }
                    }
                    return _this.writeNext('?');
                };
                this.findSupportedPins = function (data) {
                    // writes 4 bytes.
                    // with bits encoded as 'supported' pins
                    var pins = [
                        //  01, 02, 03, 04, 05, 06, 07, 08
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        //  09, 0A, 0B, 0C, 0D, 0E, 0F, 10
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        //  11, 12, 13, 14, 15, 16, 17, 18
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        //  19, 1A, 1B, 1C, 1D, 1E, 1F, 20
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0],
                    ];
                    if (data == "0100") {
                        pins[3][0] = 1;
                        pins[1][3] = 1;
                        pins[1][4] = 1;
                        pins[1][5] = 1;
                        pins[1][6] = 1;
                    }
                    if (data == "0120") {
                        pins[3][0] = 1;
                    }
                    if (data == "0140") {
                        pins[3][0] = 1;
                    }
                    if (data == "0160") {
                    }
                    if (data == "0180" || data == "01A0" || data == "01C0") {
                        return _this.writeNext('NO DATA');
                    }
                    var bytes = [];
                    for (var i = 0; i < pins.length; i++) {
                        var byte = 0;
                        for (var b = 0; b < pins[i].length; b++) {
                            if (pins[i][b] == 1) {
                                byte ^= 1 << b;
                            }
                        }
                        bytes.push(byte);
                    }
                    var byteString = ['>41', data.substring(2, 4)];
                    for (var i = 0; i < bytes.length; i++) {
                        var s = bytes[i].toString(16);
                        if (s.length == 1) {
                            s = '0' + s;
                        }
                        byteString.push(s);
                    }
                    return _this.writeNext(byteString.join(''));
                };
                if (openImmediately === true || typeof openImmediately === "undefined") {
                    process.nextTick(function () {
                        _this.emit('open');
                        _this.opened = true;
                    });
                }
            }
            FakeSerial.prototype.open = function (cb) {
                if (!this.opened) {
                    this.emit('open');
                    this.opened = true;
                }
                cb();
            };
            FakeSerial.prototype.close = function (cb) {
                if (this.opened) {
                    this.emit('close');
                    this.opened = false;
                }
                cb();
            };
            return FakeSerial;
        })(events.EventEmitter);
        Core.FakeSerial = FakeSerial;
    })(Core = OBD2.Core || (OBD2.Core = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

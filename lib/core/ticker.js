/// <reference path="../typings/tsd.d.ts"/>
var debug = require("debug")("OBD2.Core.Ticker");
var OBD2;
(function (OBD2) {
    var Core;
    (function (Core) {
        var Ticker = (function () {
            function Ticker(timeout) {
                var _this = this;
                this.stop = function () {
                    debug("Stop");
                    clearInterval(_this.Ticker);
                    _this.commands = [];
                    _this.counter = 0;
                    _this.stopped = true;
                    _this.waiting = false;
                };
                this._next = function () {
                    _this.waiting = false;
                };
                this.timeout = timeout;
                this.commands = [];
                this.counter = 0;
                this.stopped = true;
                this.waiting = false;
                debug("Ready");
            }
            Ticker.prototype.writeNext = function () {
                if (this.commands.length > 0) {
                    this.waiting = true;
                    var cmd = this.commands.shift();
                    debug("Tick " + String(cmd.type) + " : " + String(cmd.data));
                    cmd.call(this._next, cmd);
                    if (cmd.loop) {
                        this.commands.push(cmd);
                    }
                }
            };
            Ticker.prototype.addItem = function (type, data, loop, callBack) {
                loop = loop ? loop : false;
                this.commands.push({
                    type: type,
                    data: data,
                    loop: loop,
                    call: callBack,
                    fail: 0
                });
                this._autoTimer();
            };
            Ticker.prototype.delItem = function (type, data) {
                for (var index in this.commands) {
                    var cmd = this.commands[index];
                    if (cmd.type === type && cmd.data === data) {
                        if (this.commands.length > 0) {
                            this.commands.splice(index, 1);
                        }
                        break; // Loop break
                    }
                }
                this._autoTimer();
            };
            Ticker.prototype._autoTimer = function () {
                if (this.commands.length > 0) {
                    if (this.stopped) {
                        this.start();
                    }
                }
                else {
                    this.stop();
                }
            };
            Ticker.prototype.start = function () {
                var _this = this;
                debug("Start");
                this.counter = 0;
                this.stopped = false;
                this.Ticker = setInterval(function () {
                    _this.counter++;
                    if (!_this.waiting /*|| this.counter >= parseInt(10000 / this.timeout)*/) {
                        _this.writeNext();
                    }
                }, this.timeout);
            };
            Ticker.prototype.pause = function () {
                debug("Pause");
                clearInterval(this.Ticker);
            };
            return Ticker;
        })();
        Core.Ticker = Ticker;
    })(Core = OBD2.Core || (OBD2.Core = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

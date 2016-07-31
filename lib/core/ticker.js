/// <reference path="../typings/index.d.ts"/>
"use strict";
var debug = require("debug")("OBD2.Core.Ticker");
var crypto = require("crypto");
var OBD2;
(function (OBD2) {
    var Core;
    (function (Core) {
        var Ticker = (function () {
            /**
             * Constructor
             *
             * @param timeout
             * @param loopout
             */
            function Ticker(timeout, loopout) {
                var _this = this;
                /**
                 * List of items
                 */
                this.commands = [];
                /**
                 * Ticker loop
                 */
                this.loopTick = function () {
                    var cmd;
                    //console.log("WAITING", this.waiting, this.commands.length);
                    if (_this.commands.length > 0) {
                        cmd = _this.commands[0];
                        if (cmd) {
                            // Sync item
                            if (cmd.sync) {
                                // Blocking?
                                if (_this.waiting) {
                                    _this.waitNum++;
                                    if (_this.waitNum >= _this.loopout) {
                                        _this.waiting = false;
                                        _this.waitNum = 0;
                                        _this.commands.shift();
                                        if (cmd.loop) {
                                            cmd.fail = 0;
                                            _this.commands.push(cmd);
                                        }
                                    }
                                }
                                else {
                                    if (typeof cmd.call == "function") {
                                        _this.waiting = true;
                                        cmd.call(function () {
                                            if (cmd.sync) {
                                                _this.waiting = false;
                                                _this.waitNum = 0;
                                            }
                                            _this.commands.shift();
                                            if (cmd.loop) {
                                                cmd.fail = 0;
                                                _this.commands.push(cmd);
                                            }
                                        }, cmd);
                                    }
                                }
                            }
                            else {
                                cmd.call(function () {
                                    if (cmd.loop) {
                                        cmd.fail = 0;
                                        _this.commands.push(cmd);
                                    }
                                }, cmd);
                                _this.commands.shift();
                            }
                        }
                    }
                    setTimeout(_this.loopTick, _this.timeout);
                };
                this.timeout = timeout;
                this.loopout = (typeof loopout == "number" ? loopout : 1);
                this.waiting = false;
                this.reset();
                debug("Ready");
            }
            /**
             * Hashing data item
             *
             * @param type
             * @param data
             * @returns {Buffer|*}
             */
            Ticker.prototype.hashItem = function (type, data) {
                var text = type;
                if (Object.prototype.toString.call(data) == '[object Array]') {
                    text += Object.keys(data);
                    text += data.toString();
                    text += Object.keys(data);
                }
                else if (typeof data == "object") {
                    text += Object.keys(data);
                    text += Object.keys(data).map(function (key) { return data[key]; }).toString();
                    text += Object.keys(data);
                }
                else {
                    text += data;
                }
                return crypto.createHash('md5').update(text).digest('hex');
            };
            Ticker.prototype.addItemAsync = function (type, data, loop, callBack) {
                loop = loop ? loop : false;
                this.commands.push({
                    hash: this.hashItem(type, data),
                    type: type,
                    data: data,
                    loop: loop,
                    call: callBack,
                    fail: 0,
                    sync: false
                });
                this.itemNums = this.commands.length;
                this._autoTimer();
            };
            /**
             * Adding item for ticker
             *
             * @param type - Name of data type
             * @param data - Value of data type
             * @param loop - Automatic loop, or manual
             * @param callBack - Item ticking callback
             *
             * @test Obd2CoreTickerTest
             */
            Ticker.prototype.addItem = function (type, data, loop, callBack) {
                loop = loop ? loop : false;
                this.commands.push({
                    hash: this.hashItem(type, data),
                    type: type,
                    data: data,
                    loop: loop,
                    call: callBack,
                    fail: 0,
                    sync: true
                });
                this.itemNums = this.commands.length;
                this._autoTimer();
            };
            /**
             * Remove ticker item
             *
             * @param type
             * @param data
             *
             * @test Obd2CoreTickerTest
             */
            Ticker.prototype.delItem = function (type, data) {
                var hash = this.hashItem(type, data);
                for (var index in this.commands) {
                    if (this.commands.hasOwnProperty(index)) {
                        var cmd = this.commands[index];
                        if (cmd.hash === hash) {
                            if (this.commands.length > 1) {
                                this.commands.splice(index, 1);
                            }
                            else {
                                this.commands = [];
                            }
                            break; // Loop break
                        }
                    }
                }
                this.itemNums = this.commands.length;
                this._autoTimer();
            };
            /**
             * List ticker items
             *
             * @returns {any}
             *
             * @test Obd2CoreTickerTest
             */
            Ticker.prototype.getList = function () {
                return this.commands;
            };
            Ticker.prototype.setWaiting = function (waiting) {
                this.waiting = waiting;
            };
            Ticker.prototype.getWaiting = function () {
                return this.waiting;
            };
            /**
             * Starting ticker loop
             */
            Ticker.prototype.start = function () {
                debug("Start");
                this.counter = 0;
                this.stopped = false;
                this.waiting = false;
                this.waitNum = 0;
                if (!this.Ticker) {
                    this.Ticker = setTimeout(this.loopTick, this.timeout);
                }
            };
            /**
             *
             * Stopping ticker loop
             */
            Ticker.prototype.stop = function () {
                debug("Stop");
                clearTimeout(this.Ticker);
                this.reset();
            };
            Ticker.prototype.reset = function () {
                this.commands = [];
                this.counter = 0;
                this.stopped = true;
                this.waitNum = 0;
                clearTimeout(this.Ticker);
            };
            Ticker.prototype._autoTimer = function () {
                if (this.commands.length > 0) {
                    this.start();
                }
                else {
                    this.stop();
                }
            };
            return Ticker;
        }());
        Core.Ticker = Ticker;
    })(Core = OBD2.Core || (OBD2.Core = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

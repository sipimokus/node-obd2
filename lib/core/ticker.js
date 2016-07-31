/// <reference path="../typings/index.d.ts"/>
"use strict";
var debug = require("debug")("OBD2.Core.Ticker");
var crypto = require("crypto");
var OBD2;
(function (OBD2) {
    var Core;
    (function (Core) {
        var Ticker = (function () {
            function Ticker(timeout) {
                this.timeout = timeout;
                this.commands = [];
                this.counter = 0;
                this.stopped = true;
                this.waiting = false;
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
            /**
             * Get next tick
             */
            Ticker.prototype.writeNext = function () {
                var _this = this;
                setTimeout(function () {
                    if (_this.commands.length > 0) {
                        _this.waiting = true;
                        var cmd = _this.commands.shift();
                        debug("Tick " + String(cmd.type) + " : " + String(cmd.data));
                        if (typeof cmd.call == "function") {
                            cmd.call(function () {
                                _this.waiting = false;
                            }, cmd);
                        }
                        if (cmd.loop) {
                            _this.commands.push(cmd);
                        }
                        _this.counter++;
                        if (!_this.waiting) {
                            _this.writeNext();
                        }
                    }
                }, this.timeout);
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
                });
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
            /**
             * Starting ticker loop
             */
            Ticker.prototype.start = function () {
                debug("Start");
                if (!this.stopped) {
                    this.stopped = false;
                    this.writeNext();
                }
                this.counter = 0;
                //				this.Ticker  = setInterval(
                //					() =>
                //					{
                //						this.counter++;
                //						if ( !this.waiting /*|| this.counter >= parseInt(10000 / this.timeout)*/ )
                //						{
                //							this.writeNext();
                //						}
                //
                //					},
                //					this.timeout
                //				);
            };
            /**
             *
             * Stopping ticker loop
             */
            Ticker.prototype.stop = function () {
                debug("Stop");
                clearInterval(this.Ticker);
                this.commands = [];
                this.counter = 0;
                this.stopped = true;
                this.waiting = false;
            };
            /**
             * Pausing ticker loop
             */
            Ticker.prototype.pause = function () {
                debug("Pause");
                clearInterval(this.Ticker);
            };
            Ticker.prototype._autoTimer = function () {
                if (this.commands.length > 0) {
                    if (this.stopped) {
                        //this.start();
                        this.writeNext();
                    }
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

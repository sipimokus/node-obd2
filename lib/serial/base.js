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
var events = require("events");
var debug = require("debug")("OBD2.Serial.Base");
var OBD2;
(function (OBD2) {
    var Serial;
    (function (Serial) {
        var Base = (function (_super) {
            __extends(Base, _super);
            /**
             * Constructor
             */
            function Base() {
                var _this = _super.call(this) || this;
                _this.opened = false;
                _this.emit("ready");
                return _this;
            }
            Base.prototype.onData = function (callBack) {
                this.Serial.on("data", callBack);
            };
            /**
             * Serial port connect
             */
            Base.prototype.connect = function (callBack) {
                var _this = this;
                this.Serial.open(function (error) {
                    _this.opened = !!(typeof _this.Serial.isOpen === "function"
                        ? _this.Serial.isOpen()
                        : _this.Serial.isOpen);
                    if (typeof callBack === "function") {
                        callBack();
                    }
                });
            };
            /**
             * Serial port disconnect
             */
            Base.prototype.disconnect = function (callBack) {
                var _this = this;
                this.Serial.close(function (error) {
                    _this.opened = !!(typeof _this.Serial.isOpen === "function"
                        ? _this.Serial.isOpen()
                        : _this.Serial.isOpen);
                    if (typeof callBack === "function") {
                        callBack();
                    }
                });
            };
            /**
             *
             * Serial data drain
             *
             * @param data
             * @param callBack
             */
            Base.prototype.drain = function (data, callBack) {
                var _this = this;
                // Serial is opened
                if (this.opened) {
                    // Try write data
                    try {
                        this.emit("write", data);
                        this.Serial.write(data, function (error) {
                            if (typeof callBack === "function") {
                                _this.Serial.drain(callBack);
                            }
                        });
                    }
                    catch (exceptionError) {
                        debug("Error while writing, connection is probably lost.");
                        debug(exceptionError);
                    }
                }
            };
            /**
             * Serial data write
             *
             * @param data
             * @param callBack
             */
            Base.prototype.write = function (data, callBack) {
                // Serial is opened
                if (this.opened) {
                    // Try write data
                    try {
                        this.emit("write", data);
                        this.Serial.write(data, function (error) {
                            if (typeof callBack === "function") {
                                callBack();
                            }
                        });
                    }
                    catch (exceptionError) {
                        debug("Error while writing, connection is probably lost.");
                        debug(exceptionError);
                    }
                }
            };
            /**
             * Serial port instance set
             *
             * @param serial
             */
            Base.prototype.setSerial = function (serial) {
                this.Serial = serial;
                this._eventHandlers();
            };
            /**
             * Serial port instance get
             *
             * @returns {any}
             */
            Base.prototype.getSerial = function () {
                return this.Serial;
            };
            /**
             * Set serial port
             *
             * @param port
             */
            Base.prototype.setPort = function (port) {
                this.port = port;
            };
            /**
             * Get serial port
             *
             * @returns {string}
             */
            Base.prototype.getPort = function () {
                return this.port;
            };
            /**
             * Set serial options
             *
             * @param options
             */
            Base.prototype.setOptions = function (options) {
                this.options = options;
            };
            /**
             * Get serial options
             *
             * @returns {any}
             */
            Base.prototype.getOptions = function () {
                return this.options;
            };
            /**
             * Get serial port is opened
             *
             * @returns {boolean}
             */
            Base.prototype.isOpen = function () {
                return this.opened;
            };
            /**
             * Shared events handling
             *
             * @private
             */
            Base.prototype._eventHandlers = function () {
                var _this = this;
                this.Serial.on("ready", function () {
                    debug("Serial port ready");
                });
                this.Serial.on("open", function (port) {
                    debug("Serial port open : " + port);
                });
                this.Serial.on("close", function (port) {
                    debug("Serial port close: " + port);
                });
                this.Serial.on("error", function (error, port) {
                    debug("Serial port error: " + port);
                });
                this.Serial.on("data", function (data, port) {
                    _this.emit("data", data);
                    data = String(data).replace(/(?:\r\n|\r|\n)/g, "");
                    debug("Serial port data : " + data);
                });
                this.on("write", function (data, port) {
                    data = String(data).replace(/(?:\r\n|\r|\n)/g, "");
                    debug("Serial port write: " + data);
                });
            };
            return Base;
        }(events.EventEmitter));
        Serial.Base = Base;
    })(Serial = OBD2.Serial || (OBD2.Serial = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

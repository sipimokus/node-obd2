/// <reference path="typings/tsd.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="core/dtc.ts"/>
/// <reference path="core/pid.ts"/>
/// <reference path="core/obd.ts"/>
/// <reference path="core/repeater.ts"/>
/// <reference path="serial/index.ts"/>
var _dtc = require('./core/dtc');
var _pid = require('./core/pid');
var _obd = require('./core/obd');
var _repeat = require('./core/repeater');
var _device = require('./device/index');
var _serial = require('./serial/index');
var DTC = _dtc.OBD2.Core.DTC;
var PID = _pid.OBD2.Core.PID;
var OBD = _obd.OBD2.Core.OBD;
var Repeat = _repeat.OBD2.Core.Repeater;
var Device = _device.OBD2.Device.Main;
var Serial = _serial.OBD2.Serial.Main;
var events = require('events');
var debug = require("debug")("OBD2.Main");
var OBD2;
(function (OBD2) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main(options) {
            var _this = this;
            _super.call(this);
            this.start = function (cb) {
                _this.Serial.connect(_this._options.port, {
                    baudrate: _this._options.baud
                });
                _this.Serial.on("open", function (port) {
                    _this.Device.connect(_this.Serial, function () {
                        _this._initListPID(cb);
                    });
                });
                _this.Serial.on("close", function (port) {
                    _this.Device.disconnect(_this.Serial);
                });
                _this.Serial.on("data", function (data, port) {
                    _this.OBD.parseDataStream(data, function (type, mess) {
                        _this.emit("data", mess, data);
                        _this.emit(type, mess, data);
                    });
                });
            };
            this._initListPID = function (cb) {
                var syncOnDataFunc, syncOnData;
                var pidSupportList = ["00", "20", "40", "60", "80", "A0", "C0"];
                var counter = 0;
                _this.Repeat.pause();
                _this.sendPID(pidSupportList[counter], "01");
                var cleanUp = function () {
                    _this.Serial.removeListener('data', syncOnDataFunc);
                    delete syncOnData;
                    delete syncOnDataFunc;
                    _this.Repeat.start();
                    if (_this._initListPID_Timer !== null) {
                        clearTimeout(_this._initListPID_Timer);
                        _this._initListPID_Timer = null;
                        cb();
                    }
                    else {
                        clearTimeout(_this._initListPID_Timer);
                        _this._initListPID_Timer = null;
                    }
                };
                syncOnDataFunc = function (data) {
                    _this.OBD.parseDataStream(data, function (type, mess) {
                        if (type == "pid" && typeof mess.name !== "undefined" && typeof mess.value !== "undefined") {
                            _this.PID._loadPidEcuList(mess.name, mess.value);
                        }
                        _this._initListPID_Timer = setTimeout(cleanUp, 10000);
                    });
                    counter++;
                    if (counter >= pidSupportList.length) {
                        cleanUp();
                    }
                    else {
                        _this.sendPID(pidSupportList[counter], "01");
                    }
                };
                syncOnData = _this.Serial.on("data", syncOnDataFunc);
            };
            debug("Initializing");
            this._options = options;
            this.DTC = new DTC();
            this.PID = new PID();
            this.OBD = new OBD(this.PID.getList());
            this.Repeat = new Repeat(this._options.delay);
            this.Device = new Device(this._options.device);
            this.Serial = new Serial(this._options.serial);
            debug("Ready");
        }
        Main.prototype.listPID = function () {
            return this.PID.getListECU();
        };
        Main.prototype.readPID = function (pidNumber, pidMode) {
            pidMode = !pidMode ? "01" : pidMode;
            var pidData = this.PID.getByPid(pidNumber, pidMode);
            if (pidData) {
                if (pidData.pid !== "undefined") {
                    this.Serial.write(pidData.mode + pidData.pid + "1" + '\r');
                }
                else {
                    this.Serial.write(pidData.mode + "1" + '\r');
                }
            }
            else {
                this.Serial.write(pidMode + pidNumber + "1" + '\r');
            }
        };
        Main.prototype.sendPID = function (pidNumber, pidMode) {
            pidMode = !pidMode ? "01" : pidMode;
            var pidData = this.PID.getByPid(pidNumber, pidMode);
            if (pidData) {
                if (pidData.pid !== "undefined") {
                    this.Serial.write(pidData.mode + pidData.pid + '\r');
                }
                else {
                    this.Serial.write(pidData.mode + '\r');
                }
            }
            else {
                this.Serial.write(pidMode + pidNumber + '\r');
            }
        };
        /*public writePid( data : any, pidNumber : string, pidMode? : string )
        {
            pidMode = !pidMode ? "01" : pidMode;
        }*/
        Main.prototype.write = function (data) {
        };
        return Main;
    })(events.EventEmitter);
    OBD2.Main = Main;
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

/// <reference path="typings/main.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="core/dtc.ts"/>
/// <reference path="core/pid.ts"/>
/// <reference path="core/obd.ts"/>
/// <reference path="core/ticker.ts"/>
/// <reference path="device/index.ts"/>
/// <reference path="serial/index.ts"/>
var _dtc = require("./core/dtc");
var _pid = require("./core/pid");
var _obd = require("./core/obd");
var _ticker = require("./core/ticker");
var _device = require("./device/index");
var _serial = require("./serial/index");
var DTC = _dtc.OBD2.Core.DTC;
var PID = _pid.OBD2.Core.PID;
var OBD = _obd.OBD2.Core.OBD;
var Ticker = _ticker.OBD2.Core.Ticker;
var Device = _device.OBD2.Device.Main;
var Serial = _serial.OBD2.Serial.Main;
var events = require("events");
var debug = require("debug")("OBD2.Main");
var OBD2;
(function (OBD2) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main(options) {
            var _this = this;
            _super.call(this);
            this.listPID = function (callBack) {
                var pidSupportList = ["00", "20", "40", "60", "80", "A0", "C0"];
                if (_this.PID.getList().length > 0) {
                    callBack(_this.PID.getList());
                }
                else {
                    _this._tickListPID(pidSupportList, function (a) {
                        callBack(_this.PID.getList());
                    });
                }
            };
            /**
             * Writing PID
             *
             * @param replies
             * @param loop
             * @param pidNumber
             * @param pidMode
             * @param callBack
             */
            this.writePID = function (replies, loop, pidNumber, pidMode, callBack) {
                // Arguments
                if (typeof pidMode === "function") {
                    callBack = pidMode;
                    pidMode = "01";
                }
                else {
                    pidMode = !pidMode ? "01" : pidMode;
                }
                // Vars
                var pidData = _this.PID.getByPid(pidNumber, pidMode);
                var sendData = "";
                replies = !replies ? "" : replies;
                // PID defined?
                if (pidData) {
                    // MODE + PID + (send/read)
                    if (pidData.pid !== "undefined") {
                        sendData = pidData.mode + pidData.pid + replies + "\r";
                    }
                    else {
                        sendData = pidData.mode + replies + "\r";
                    }
                }
                else {
                    sendData = pidMode + pidNumber + replies + "\r";
                }
                // Add Ticker
                _this.Ticker.addItem("PID", sendData, !!loop, function (next, elem) {
                    // Timeout var for auto cleaning
                    var itemSkip;
                    // Send data
                    if (elem.fail % 20 === 0) {
                        _this.Serial.drain(sendData);
                    }
                    // Detected parsed PID data
                    _this.once("pid", function (mess, data) {
                        if (typeof callBack === "function") {
                            callBack(mess, data);
                        }
                        clearTimeout(itemSkip);
                        itemSkip = undefined;
                        next();
                    });
                    // Timeout timer
                    itemSkip = setTimeout(function () {
                        // Fail to remove
                        elem.fail++;
                        // Auto remover, 60 loop wait, 4 sending try
                        if (_this._options.cleaner && elem.fail > 60) {
                            _this.Ticker.delItem("PID", sendData);
                        }
                        next();
                    }, _this._options.delay);
                    /*
                     // Direct callBack
                     if ( typeof callBack === "function" )
                     {
                     // Detected parsed PID data
                     this.once("pid", ( mess, data ) =>
                     {
                     callBack( mess, data );
    
                     clearTimeout( itemSkip );
                     delete itemSkip;
    
                     next();
                     });
                     }
    
                     // Without direct callback
                     else
                     {
                     // Auto remover, 100 loop wait
                     if ( this._options.cleaner )
                     {
                     // Timeout timer
                     itemSkip = setTimeout(()=>
                     {
                     // Fail to remove
                     elem.fail++;
                     console.log(elem.data, elem.fail);
                     if ( elem.fail === 100 )
                     {
                     this.Ticker.delItem( "PID", sendData );
                     }
    
                     next();
    
                     }, this._options.delay );
                     }
    
                     // Next Tick
                     next();
                     }
                     */
                });
            };
            /**
             * Sending PID code
             *
             * @param pidNumber
             * @param pidMode
             * @param callBack
             */
            this.sendPID = function (pidNumber, pidMode, callBack) {
                _this.writePID(undefined, false, pidNumber, pidMode, callBack);
            };
            /**
             * Reading PID code
             *
             * @param pidNumber
             * @param pidMode
             * @param callBack
             */
            this.readPID = function (pidNumber, pidMode, callBack) {
                _this.writePID("1", true, pidNumber, pidMode, callBack);
            };
            debug("Initializing");
            this._options = options;
            this.DTC = new DTC();
            this.PID = new PID();
            this.OBD = new OBD(this.PID.getListPID());
            this.Ticker = new Ticker(this._options.delay);
            this.Device = new Device(this._options.device);
            this.Serial = new Serial(this._options.serial, this._options.port, {
                baudrate: this._options.baud
            });
            debug("Ready");
        }
        Main.prototype.start = function (callBack) {
            /*this.Serial.onData( ( data ) =>
             {
             console.log("data1", data);
             });*/
            var _this = this;
            this.Serial.on("data", function (data) {
                _this.OBD.parseDataStream(data, function (type, mess) {
                    _this.emit(type, mess, data);
                    _this.emit("dataParsed", type, mess, data);
                });
                _this.emit("dataReceived", data);
            });
            this.Serial.connect(function () {
                _this.Device.connect(_this, function () {
                    /*this.Serial.getSerial().on("data", ( data ) =>
                     {
                     console.log("data2", data);
                     });*/
                    callBack();
                });
            });
        };
        Main.prototype.sendAT = function (atCommand) {
            //atCommand = atCommand.replace(/" "/g, "");
            //atCommand = String(atCommand).replace(" ", "");
            var _this = this;
            this.Ticker.addItem("AT", atCommand, false, function (next) {
                _this.Serial.drain(atCommand + "\r");
                _this.once("dataReceived", function (data) {
                    // Wait a bit
                    setTimeout(next, 100);
                });
            });
        };
        Main.prototype._tickListPID = function (pidList, callBack) {
            var _this = this;
            if (pidList.length <= 0) {
                callBack();
            }
            var cmdPid = pidList.shift();
            if (this.PID.getListECU().length > 0 && this.PID.getListECU().indexOf(cmdPid) < 0) {
                callBack();
            }
            this.sendPID(cmdPid, "01", function (mess, data) {
                if (_this.PID._loadPidEcuList(mess.name, mess.value)) {
                    _this._tickListPID(pidList, callBack);
                }
                else {
                    callBack();
                }
            });
        };
        return Main;
    })(events.EventEmitter);
    OBD2.Main = Main;
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

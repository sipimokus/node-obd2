/// <reference path="../typings/index.d.ts"/>
"use strict";
var fs = require("fs");
var path = require("path");
var debug = require("debug")("OBD2.Core.PID");
var OBD2;
(function (OBD2) {
    var Core;
    (function (Core) {
        var PID = (function () {
            /**
             * Constructor
             *
             * @test Obd2CorePidTest
             */
            function PID() {
                var _this = this;
                /**
                 * Loaded data PID list
                 *
                 * @type {Array}
                 */
                this.listPid = [];
                /**
                 * Supported ECU list
                 *
                 * @type {Array}
                 */
                this.listEcu = [];
                /**
                 * Real ECU+DATA supported PID list
                 *
                 * @type {Array}
                 */
                this.pidEcuList = [];
                /**
                 * Loading PID details from data directory
                 *
                 * @param basePath
                 * @private
                 *
                 * @test Obd2CorePidTest
                 */
                this._loadPidList = function (basePath) {
                    debug("Loading list");
                    basePath = basePath
                        ? basePath
                        : path.join(__dirname, "..", "data", "pid");
                    try {
                        if (fs.statSync(basePath)) {
                            fs.readdirSync(basePath).forEach(function (file) {
                                var tmpPidObject = require(path.join(basePath, file));
                                _this.listPid.push(tmpPidObject);
                            });
                        }
                    }
                    catch (e) {
                        debug("[ERROR] Data directory not found!");
                    }
                    debug("Loaded count: " + _this.listPid.length);
                };
                this._loadPidList();
                debug("Ready");
            }
            /**
             * PID support command parser, and appender
             *
             * @param returnType
             * @param returnValue
             * @returns {boolean}
             * @private
             *
             * @test Obd2CorePidTest
             */
            PID.prototype._loadPidEcuList = function (returnType, returnValue) {
                var decodeList = {
                    0: [0, 0, 0, 0],
                    1: [0, 0, 0, 1],
                    2: [0, 0, 1, 0],
                    3: [0, 0, 1, 1],
                    4: [0, 1, 0, 0],
                    5: [0, 1, 0, 1],
                    6: [0, 1, 1, 0],
                    7: [0, 1, 1, 1],
                    8: [1, 0, 0, 0],
                    9: [1, 0, 0, 1],
                    A: [1, 0, 1, 0],
                    B: [1, 0, 1, 1],
                    C: [1, 1, 0, 0],
                    D: [1, 1, 0, 1],
                    E: [1, 1, 1, 0],
                    F: [1, 1, 1, 1],
                };
                var pidCommands = {
                    "pidsupp0": "00",
                    "pidsupp2": "20",
                    "pidsupp4": "40",
                    "pidsupp6": "60",
                    "pidsupp8": "80",
                    "pidsuppa": "A0",
                    "pidsuppc": "C0",
                };
                var hexNum;
                var defNum = 0;
                var tmpPid = "";
                var tmpFind = false;
                // pidsupp0, pidsupp2, ...
                if (typeof pidCommands[returnType] === "undefined") {
                    return false;
                }
                // Start list, pl [00-19, 20-39, 40-59, ...]
                defNum = this._hex2dec(pidCommands[returnType]);
                // Hexadecimal value
                // Pl.: BE1FA813
                returnValue = String(returnValue);
                // Átfutunk a bejövő számon
                for (var i = 0; i < returnValue.length; i++) {
                    hexNum = this._hex2dec(returnValue.charAt(i));
                    // Megnézzük melyik PID támogatott
                    for (var j = 0; j < 4; j++) {
                        // Check PID is supported
                        if (decodeList[returnValue.charAt(i)][j] === 1) {
                            // Pl.: 0*4 + 1*1 = 01
                            // 2*4 + 0*3 = 11 = 0B
                            // defNum is a shifting number
                            // Pl: 20 + 0*4 + 1 = 21
                            tmpPid = this._dec2hex(defNum + (i * 4) + (j + 1));
                            if (tmpPid.length === 1) {
                                tmpPid = "0" + tmpPid;
                            }
                            // Push supperted PID
                            this.listEcu.push(tmpPid);
                            tmpFind = true;
                        }
                    }
                }
                // Clear array
                this.listEcu = this.listEcu.filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                });
                return tmpFind;
            };
            /**
             * Get real supported ECU PID list
             *
             * @returns {any}
             *
             * @test Obd2CorePidTest
             */
            PID.prototype.getList = function () {
                if (this.pidEcuList.length > 0) {
                    return this.pidEcuList;
                }
                for (var index in this.listPid) {
                    if (this.listPid.hasOwnProperty(index)) {
                        var temp = String(this.listPid[index].pid);
                        if (temp && this.listEcu.indexOf(temp) > -1) {
                            this.pidEcuList.push(temp);
                        }
                    }
                }
                this.pidEcuList = this.pidEcuList.filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                });
                return this.pidEcuList;
            };
            /**
             * Get PID details list
             *
             * @returns {any}
             *
             * @test Obd2CorePidTest
             */
            PID.prototype.getListPID = function () {
                return this.listPid;
            };
            /**
             * Get supported ECU PID list
             *
             * @returns {any}
             *
             * @test Obd2CorePidTest
             */
            PID.prototype.getListECU = function () {
                return this.listEcu;
            };
            /**
             * Get PID details by name/slug
             *
             * @param slug
             * @returns {any}
             *
             * @test Obd2CorePidTest
             */
            PID.prototype.getByName = function (slug) {
                for (var index in this.listPid) {
                    if (typeof this.listPid[index].name === "undefined") {
                        continue;
                    }
                    if (this.listPid[index].name.toLowerCase() === slug.toLowerCase()) {
                        return this.listPid[index];
                    }
                }
                return undefined;
            };
            /**
             * Get PID details by pid/mode
             *
             * @param pid
             * @param mode
             * @returns {any}
             *
             * @test Obd2CorePidTest
             */
            PID.prototype.getByPid = function (pid, mode) {
                mode = !mode ? "01" : mode;
                for (var index in this.listPid) {
                    if (typeof this.listPid[index].pid === "undefined"
                        || typeof this.listPid[index].mode === "undefined") {
                        continue;
                    }
                    if (this.listPid[index].pid.toLowerCase() === pid.toLowerCase()
                        && this.listPid[index].mode.toLowerCase() === mode.toLowerCase()) {
                        return this.listPid[index];
                    }
                }
                return undefined;
            };
            /**
             * Converting DEC to HEX number
             *
             * @param decNumber
             * @returns {string}
             * @private
             *
             * @test Obd2CorePidTest
             */
            PID.prototype._dec2hex = function (decNumber) {
                var hexNumber;
                if (decNumber < 0) {
                    decNumber = 0xFFFFFFFF + decNumber + 1;
                }
                hexNumber = String(decNumber.toString(16).toUpperCase());
                if (hexNumber.length === 1) {
                    hexNumber = "0" + hexNumber;
                }
                return hexNumber;
            };
            /**
             * Converting HEX to DEC number
             *
             * @param hexNumber
             * @returns {number}
             * @private
             *
             * @test Obd2CorePidTest
             */
            PID.prototype._hex2dec = function (hexNumber) {
                return parseInt(hexNumber, 16);
            };
            return PID;
        }());
        Core.PID = PID;
    })(Core = OBD2.Core || (OBD2.Core = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

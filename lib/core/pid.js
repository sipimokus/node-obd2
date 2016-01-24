/// <reference path="../typings/tsd.d.ts"/>
var fs = require('fs');
var path = require('path');
var debug = require("debug")("OBD2.Core.PID");
var OBD2;
(function (OBD2) {
    var Core;
    (function (Core) {
        var PID = (function () {
            function PID() {
                var _this = this;
                this.list = [];
                this.listEcu = [];
                this._loadPidList = function () {
                    debug("Loading list");
                    var basePath = path.join(__dirname, "..", "data", "pid");
                    try {
                        if (fs.statSync(basePath)) {
                            fs.readdirSync(basePath).forEach(function (file) {
                                var tmpPidObject = require(path.join(basePath, file));
                                _this.list.push(tmpPidObject);
                            });
                        }
                    }
                    catch (e) {
                        debug("[ERROR] Data directory not found!");
                    }
                    debug("Loaded count: " + _this.list.length);
                };
                this._loadPidEcuList = function (returnType, returnValue) {
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
                        F: [1, 1, 1, 1]
                    };
                    var pidCommands = {
                        "pidsupp0": "00",
                        "pidsupp2": "20",
                        "pidsupp4": "40",
                        "pidsupp6": "60",
                        "pidsupp8": "80",
                        "pidsuppa": "A0",
                        "pidsuppc": "C0"
                    };
                    var hexNum;
                    var defNum = 0;
                    var tmpPid = '';
                    // pidsupp0, pidsupp2, ...
                    if (typeof pidCommands[returnType] == "undefined")
                        return false;
                    // Start list, pl [00-19, 20-39, 40-59, ...]
                    defNum = _this._hex2dec(pidCommands[returnType]);
                    // Hexadecimal value
                    // Pl.: BE1FA813
                    returnValue = String(returnValue);
                    // Átfutunk a bejövő számon
                    for (var i = 0; i < returnValue.length; i++) {
                        hexNum = _this._hex2dec(returnValue.charAt(i));
                        // Megnézzük melyik PID támogatott
                        for (var j = 0; j < 4; j++) {
                            // Check PID is supported
                            if (decodeList[returnValue.charAt(i)][j] == 1) {
                                // Pl.: 0*4 + 1*1 = 01
                                // 2*4 + 0*3 = 11 = 0B
                                // defNum is a shifting number
                                // Pl: 20 + 0*4 + 1 = 21
                                tmpPid = _this._dec2hex(defNum + (i * 4) + (j + 1));
                                if (tmpPid.length === 1)
                                    tmpPid = '0' + tmpPid;
                                // Push supperted PID
                                _this.listEcu.push(tmpPid);
                            }
                        }
                    }
                };
                this._dec2hex = function (number) {
                    if (number < 0) {
                        number = 0xFFFFFFFF + number + 1;
                    }
                    number = String(number.toString(16).toUpperCase());
                    if (number.length === 1)
                        number = '0' + number;
                    return number;
                };
                this._hex2dec = function (number) {
                    return parseInt(number, 16);
                };
                this.getList = function () {
                    return _this.list;
                };
                this.getByName = function (slug) {
                    for (var index in _this.list) {
                        if (typeof _this.list[index].name === "undefined") {
                            continue;
                        }
                        if (_this.list[index].name.toLowerCase() === slug.toLowerCase()) {
                            return _this.list[index];
                        }
                    }
                    return null;
                };
                this.getByPid = function (pid, mode) {
                    mode = !mode ? "09" : mode;
                    for (var index in _this.list) {
                        if (typeof _this.list[index].pid === "undefined"
                            || typeof _this.list[index].mode === "undefined") {
                            continue;
                        }
                        if (_this.list[index].pid.toLowerCase() === pid.toLowerCase()
                            && _this.list[index].mode.toLowerCase() === mode.toLowerCase()) {
                            return _this.list[index];
                        }
                    }
                    return null;
                };
                this._loadPidList();
                debug("Ready");
            }
            PID.prototype.getListECU = function () {
                return this.listEcu;
            };
            return PID;
        })();
        Core.PID = PID;
    })(Core = OBD2.Core || (OBD2.Core = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

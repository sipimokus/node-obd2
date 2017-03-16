/// <reference path="../typings/main.d.ts"/>
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug")("OBD2.Core.OBD");
var OBD2;
(function (OBD2) {
    var Core;
    (function (Core) {
        var OBD = (function () {
            // https://www.scantool.net/forum/index.php?topic=6927.0
            function OBD(pidList) {
                this._deviceCommands = [
                    "?",
                    "OK",
                    "SEARCHING",
                    "SEARCHING...",
                    "UNABLE TO CONNECT",
                    "STOPPED",
                    "NO DATA",
                    "CAN ERROR",
                    "ERROR",
                    "BUS INIT",
                ];
                this._pidList = pidList;
                this._dataReceived = "";
                debug("Ready");
            }
            OBD.prototype.parseDataStreamReady = function (messageString, cb) {
                debug("   Serial data line : " + messageString);
                var forString, arrayOfCommands;
                if (messageString === "") {
                    return;
                }
                var reply = this.parseCommand(messageString);
                if (this._deviceCommands.indexOf(messageString) > -1) {
                    cb("ecu", reply, messageString);
                }
                else {
                    if (typeof reply.value === "undefined" || !reply.name || (!reply.mode && !reply.pid)) {
                        cb("bug", reply, messageString);
                    }
                    else if (reply.mode === "41") {
                        cb("pid", reply, messageString);
                    }
                    else if (reply.mode === "43") {
                        cb("dtc", reply, messageString);
                    }
                }
            };
            OBD.prototype.parseDataLCommands = function (dataString, splitChar, cb) {
                var firstData = "", secondData = "", tmpString;
                if (!splitChar || !dataString || typeof dataString !== "string") {
                    return;
                }
                if (dataString.indexOf(splitChar) > -1) {
                    tmpString = dataString.split(splitChar);
                    for (var i = 0; i < tmpString.length; i++) {
                        if (tmpString[i] === "\r" ||
                            tmpString[i] === "\n" ||
                            tmpString[i] === splitChar ||
                            !tmpString[i]) {
                            continue;
                        }
                        if (firstData === "") {
                            firstData = tmpString[i];
                        }
                        else {
                            secondData += tmpString[i];
                        }
                    }
                    this.parseDataStreamReady(firstData, cb);
                    dataString = this._dataReceived = secondData;
                }
                return dataString;
            };
            /**
             * Parse Serial data stream to PID details
             *
             * @param data
             * @param cb
             */
            OBD.prototype.parseDataStream = function (data, cb) {
                var currentString, forString, arrayOfCommands, dataString;
                var modifiedSuccess = false;
                var delimiters = [">", "\r", "..."];
                // making sure it's a utf8 string
                dataString = data.toString("utf8");
                currentString = this._dataReceived + dataString;
                for (var i = 0; i < delimiters.length; i++) {
                    if (typeof currentString === "string" && currentString.indexOf(delimiters[i]) > -1) {
                        currentString = this.parseDataLCommands(currentString, delimiters[i], cb);
                        modifiedSuccess = true;
                    }
                }
                if (!modifiedSuccess) {
                    this._dataReceived = currentString;
                }
            };
            /**
             * Parses a hexadecimal string to a reply object. Uses PIDS.
             *
             * @param {string} hexString Hexadecimal value in string that is received over the serialport.
             * @return {Object} reply - The reply.
             * @return {string} reply.value - The value that is already converted. This can be a PID converted answer or "OK" or "NO DATA".
             * @return {string} reply.name - The name. --! Only if the reply is a PID.
             * @return {string} reply.mode - The mode of the PID. --! Only if the reply is a PID.
             * @return {string} reply.pid - The PID. --! Only if the reply is a PID.
             */
            OBD.prototype.parseCommand = function (hexString) {
                var reply = {
                    value: undefined,
                    name: undefined,
                    mode: undefined,
                    pid: undefined,
                    min: undefined,
                    max: undefined,
                    unit: undefined,
                }, byteNumber, valueArray; //New object
                // No data or OK is the response.
                if (hexString === "NO DATA" || hexString === "OK" || hexString === "?") {
                    reply.value = hexString;
                    return reply;
                }
                hexString = hexString.replace(/ /g, ""); //Whitespace trimming //Probably not needed anymore?
                valueArray = [];
                for (byteNumber = 0; byteNumber < hexString.length; byteNumber += 2) {
                    valueArray.push(hexString.substr(byteNumber, 2));
                }
                // PID mode
                if (valueArray[0] === "41") {
                    reply.mode = valueArray[0];
                    reply.pid = valueArray[1];
                    for (var i = 0; i < this._pidList.length; i++) {
                        if (this._pidList[i].pid === reply.pid) {
                            var numberOfBytes = this._pidList[i].bytes;
                            reply.name = this._pidList[i].name;
                            reply.min = this._pidList[i].min;
                            reply.max = this._pidList[i].max;
                            reply.unit = this._pidList[i].unit;
                            // Use static parameter (performance up, usually)
                            switch (numberOfBytes) {
                                case 1:
                                    reply.value = this._pidList[i].convertToUseful(valueArray[2]);
                                    break;
                                case 2:
                                    reply.value = this._pidList[i].convertToUseful(valueArray[2], valueArray[3]);
                                    break;
                                case 4:
                                    reply.value = this._pidList[i].convertToUseful(valueArray[2], valueArray[3], valueArray[4], valueArray[5]);
                                    break;
                                case 8:
                                    reply.value = this._pidList[i].convertToUseful(valueArray[2], valueArray[3], valueArray[4], valueArray[5], valueArray[6], valueArray[7], valueArray[8], valueArray[9]);
                                    break;
                                // Special length, dynamic parameters
                                default:
                                    reply.value = this._pidList[i].convertToUseful.apply(this, valueArray.slice(2, 2 + parseInt(numberOfBytes, 10)));
                                    break;
                            }
                            //Value is converted, break out the for loop.
                            break;
                        }
                    }
                }
                else if (valueArray[0] === "43") {
                    reply.mode = valueArray[0];
                    for (var i = 0; i < this._pidList.length; i++) {
                        if (this._pidList[i].mode === "03") {
                            reply.name = this._pidList[i].name;
                            reply.value = this._pidList[i].convertToUseful(valueArray[1], valueArray[2], valueArray[3], valueArray[4], valueArray[5], valueArray[6]);
                        }
                    }
                }
                return reply;
            };
            return OBD;
        }());
        Core.OBD = OBD;
    })(Core = OBD2.Core || (OBD2.Core = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

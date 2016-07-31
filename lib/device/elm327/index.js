/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>
"use strict";
var OBD2;
(function (OBD2) {
    var Device;
    (function (Device) {
        var ELM327 = (function () {
            function ELM327() {
                this.connect = function (Serial, callBack) {
                    // Set all to Defaults
                    Serial.sendAT("AT D");
                    // Reset all
                    Serial.sendAT("AT Z");
                    // Turns off extra line feed and carriage return
                    Serial.sendAT("AT L0");
                    // Turns off echo.
                    Serial.sendAT("AT E0");
                    // This disables spaces in in output, which is faster!
                    Serial.sendAT("AT S0");
                    // Turns off headers and checksum to be sent.
                    Serial.sendAT("AT H0");
                    // Turn adaptive timing to 2. This is an aggressive learn curve for adjusting the timeout.
                    // Will make huge difference on slow systems.
                    Serial.sendAT("AT AT2");
                    // Set timeout to 10 * 4 = 40msec, allows +20 queries per second.
                    // This is the maximum wait-time. ATAT will decide if it should wait shorter or not.
                    //this.write('ATST0A');
                    // Set the protocol to automatic.
                    Serial.sendAT("AT SP0");
                    // CallBack
                    callBack();
                };
            }
            ELM327.prototype.disconnect = function () {
                //
            };
            return ELM327;
        }());
        Device.ELM327 = ELM327;
    })(Device = OBD2.Device || (OBD2.Device = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

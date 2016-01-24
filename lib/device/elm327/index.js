/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="../../serial/index.ts"/>
var OBD2;
(function (OBD2) {
    var Device;
    (function (Device) {
        var ELM327 = (function () {
            function ELM327() {
                this.connect = function (Serial, cb) {
                    // Set all to Defaults
                    Serial.write("ATD");
                    // Reset all
                    Serial.write("ATZ");
                    //Turns off echo.
                    Serial.write("ATE0");
                    //Turns off extra line feed and carriage return
                    Serial.write("ATL0");
                    //This disables spaces in in output, which is faster!
                    Serial.write("ATS0");
                    //Turns off headers and checksum to be sent.
                    Serial.write("ATH0");
                    //Turn adaptive timing to 2. This is an aggressive learn curve for adjusting the timeout. Will make huge difference on slow systems.
                    Serial.write("ATAT2");
                    //Set timeout to 10 * 4 = 40msec, allows +20 queries per second. This is the maximum wait-time. ATAT will decide if it should wait shorter or not.
                    //this.write('ATST0A');
                    //Set the protocol to automatic.
                    Serial.write("ATSP0");
                    // CallBack
                    setTimeout(cb, 500);
                };
            }
            ELM327.prototype.disconnect = function () {
            };
            ELM327.prototype.cmdWrite = function () {
            };
            ELM327.prototype.cmdRead = function () {
            };
            return ELM327;
        })();
        Device.ELM327 = ELM327;
    })(Device = OBD2.Device || (OBD2.Device = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

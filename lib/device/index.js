/// <reference path="../typings/main.d.ts"/>
/// <reference path="../serial/index.ts"/>
var path = require("path");
var debug = require("debug")("OBD2.Device.Main");
var OBD2;
(function (OBD2) {
    var Device;
    (function (Device) {
        var Main = (function () {
            function Main(deviceName) {
                if (deviceName) {
                    this.loadDevice(deviceName);
                }
                debug("Ready");
            }
            Main.prototype.connect = function (Serial, cb) {
                debug("Connecting");
                this.Device.connect(Serial, function () {
                    debug("Connected");
                    // Callback
                    cb();
                });
            };
            Main.prototype.disconnect = function (Serial) {
                //
            };
            Main.prototype.loadDevice = function (deviceName) {
                this._name = deviceName.toLowerCase();
                this.Device = new (require(path.join(__dirname, this._name, "index"))).OBD2.Device.ELM327();
                debug("Loaded device: " + this._name);
            };
            Main.prototype.getDevice = function () {
                return this.Device;
            };
            Main.prototype.getDeviceName = function () {
                return this._name;
            };
            Main.prototype.setDevice = function (deviceObject) {
                this.Device = deviceObject;
            };
            return Main;
        })();
        Device.Main = Main;
    })(Device = OBD2.Device || (OBD2.Device = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

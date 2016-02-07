/// <reference path="../typings/main.d.ts"/>
var fs = require("fs");
var path = require("path");
var debug = require("debug")("OBD2.Core.DTC");
var OBD2;
(function (OBD2) {
    var Core;
    (function (Core) {
        var DTC = (function () {
            function DTC() {
                this.list = [];
                this._loadDtcList();
                debug("Ready");
            }
            DTC.prototype._loadDtcList = function (basePath) {
                var _this = this;
                debug("Loading list");
                basePath = basePath
                    ? basePath
                    : path.join(__dirname, "..", "data", "dtc");
                try {
                    if (fs.statSync(basePath)) {
                        fs.readdirSync(basePath).forEach(function (file) {
                            _this.list.push(require(path.join(basePath, file)));
                        });
                    }
                }
                catch (e) {
                    debug("[ERROR] Data directory not found!");
                }
                debug("Loaded count: " + this.list.length);
            };
            DTC.prototype.getList = function () {
                return this.list;
            };
            DTC.prototype.getByName = function (slug) {
                //
            };
            DTC.prototype.getByPid = function (pid, mode) {
                //
            };
            return DTC;
        })();
        Core.DTC = DTC;
    })(Core = OBD2.Core || (OBD2.Core = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

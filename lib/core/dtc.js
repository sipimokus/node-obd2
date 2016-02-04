/// <reference path="../typings/tsd.d.ts"/>
var fs = require('fs');
var path = require('path');
var debug = require("debug")("OBD2.Core.DTC");
var OBD2;
(function (OBD2) {
    var Core;
    (function (Core) {
        var DTC = (function () {
            function DTC() {
                var _this = this;
                this.list = [];
                this._loadDtcList = function () {
                    debug("Loading list");
                    var basePath = path.join(__dirname, "..", "data", "dtc");
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
                    debug("Loaded count: " + _this.list.length);
                };
                this.getList = function () {
                    return _this.list;
                };
                this.getByName = function (slug) {
                };
                this.getByPid = function (pid, mode) {
                };
                this._loadDtcList();
                debug("Ready");
            }
            return DTC;
        })();
        Core.DTC = DTC;
    })(Core = OBD2.Core || (OBD2.Core = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

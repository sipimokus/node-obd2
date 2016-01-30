/// <reference path="../typings/tsd.d.ts"/>
var debug = require("debug")("OBD2.Core.Repeater");
var _interval;
var OBD2;
(function (OBD2) {
    var Core;
    (function (Core) {
        var Repeater = (function () {
            function Repeater(delay) {
                var _this = this;
                this.delay = 250;
                this.loop = false;
                this._list = [];
                this._index = -1;
                this._count = 0;
                this._interval = null;
                this._runCall = null;
                this.runItem = function (callback) {
                    if (typeof callback === "function")
                        _this._runCall = callback;
                };
                this.addItem = function (repeatItem) {
                    if (_this.loop) {
                        _this.pause();
                        if (!(_this._list.indexOf(repeatItem) >= 0)) {
                            _this._list.push(repeatItem);
                        }
                        _this.start();
                    }
                    else {
                        if (!(_this._list.indexOf(repeatItem) >= 0)) {
                            _this._list.push(repeatItem);
                        }
                    }
                };
                this.addItemList = function (repeatItemList) {
                    if (_this.loop) {
                        _this.pause();
                        for (var repeatItem in repeatItemList) {
                            _this._list.push(repeatItemList[repeatItem]);
                        }
                        _this.start();
                    }
                    else {
                        for (var repeatItem in repeatItemList) {
                            _this._list.push(repeatItemList[repeatItem]);
                        }
                    }
                };
                this.delItem = function (repeatItem) {
                    // Searching poller
                    var index = _this._list.indexOf(repeatItem);
                    if (index >= 0) {
                        _this.pause();
                        // Clear list if we have 1 item
                        if (_this._list.length <= 1) {
                            _this.reset(true);
                        } // Remove elem from array, and shifting
                        else {
                            _this._list.splice(index, 1);
                        }
                        _this.start();
                    }
                };
                this.getList = function () {
                    return _this._list;
                };
                this.pause = function () {
                    clearTimeout(_interval);
                    _this.loop = false;
                };
                this.start = function () {
                    _this.pause();
                    _this.reset();
                    _this._setInterval();
                    _this.loop = true;
                    /*if ( this.delay > 0 )
                    {
                        _interval = setInterval( () =>
                        {
                            this.nextItem();
    
                        }, this.delay);
    
                        this.loop = true;
                    }
                    else
                    {
    
                    }*/
                };
                this._setInterval = function () {
                    _interval = setTimeout(function () {
                        _this.nextItem();
                        _this._setInterval();
                    }, _this.delay);
                };
                this.stop = function () {
                    clearTimeout(_interval);
                    _this.reset();
                    _this.loop = false;
                };
                this.reset = function (resetList) {
                    if (resetList) {
                        _this._list = [];
                    }
                    _this._index = -1;
                    _this._count = _this._list.length;
                };
                this.setDelay = function (time) {
                    if (typeof time === "number") {
                        _this.delay = time;
                    }
                    debug("Delay time set: " + _this.delay + "ms");
                };
                this.nextItem = function () {
                    if (_this._count <= 0) {
                        return;
                    }
                    _this._index++;
                    if (_this._list[_this._index]) {
                        if (_this._runCall) {
                            _this._runCall(_this._list[_this._index]);
                        }
                        else {
                            _this._list[_this._index]();
                        }
                    }
                    if (_this._index >= _this._count - 1) {
                        _this._index = -1;
                    }
                };
                this.setDelay(delay);
                debug("Ready");
            }
            return Repeater;
        })();
        Core.Repeater = Repeater;
    })(Core = OBD2.Core || (OBD2.Core = {}));
})(OBD2 = exports.OBD2 || (exports.OBD2 = {}));

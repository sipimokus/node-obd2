
var util = require('util'),
    EventEmitter = require('events').EventEmitter;

var commands = [];
require('fs').readdirSync(__dirname + '/commands').forEach(function (e) {
    commands.push(require('./commands/' + e));
});

var FakeSerial = function () {
    var self = this;

    self.modes = {
        L: 1,
        E: 1
    }

    process.nextTick(function () {
        self.emit('open');
    });
}

module.exports = FakeSerial;

util.inherits(FakeSerial, EventEmitter);

FakeSerial.prototype.write = function(data) {
    var self = this;

    data = data.replace("\n", "").replace("\r", "");

    if (data.substring(0, 2) == "AT") {
        var mode = data.substring(3, 4);
        for (m in this.modes) {
            if (mode == m) {
                this.modes[m] = 0;

                if (data.substring(4, 5) == "1") {
                    this.modes[m] = 1;
                }
            }
        }
    }

    if (this.modes.E) {
        // echo
        //this.writeNext(data);
    }

    if (data == "AT E0") {
        this.writeNext(data);

        return;
    }

    if (data == "0100" || data == "0120" || data == "0140" || data == "0160") {
        return this.findSupportedPins(data);
    }

    if (data.substring(0, 2) != "01") {
        return this.writeNext('?');
    }

    var cmd = data.substring(2, 4);
    for (var i = 0; i < commands.length; i++) {
        if (commands[i].id == cmd) {
            var res = commands[i].fakeResponse(data).toString(16);
            if (res.length % 2 == 1) {
                res = '0' + res;
            }

            return this.writeNext('>41' + cmd + '' + res);
        }
    }

    return this.writeNext('?');
}

FakeSerial.prototype.writeNext = function (data) {
    var self = this;

    process.nextTick(function () {
        self.emit('data', data + "\r\r");
    });
}

FakeSerial.prototype.findSupportedPins = function (data)
{
    var self = this;

    // writes 4 bytes.
    // with bits encoded as 'supported' pins

    var pins = [
        //  01, 02, 03, 04, 05, 06, 07, 08
        [ 0,  0,  0,  0,  0,  0,  0,  0],
        //  09, 0A, 0B, 0C, 0D, 0E, 0F, 10
        [ 0,  0,  0,  0,  0,  0,  0,  0],
        //  11, 12, 13, 14, 15, 16, 17, 18
        [ 0,  0,  0,  0,  0,  0,  0,  0],
        //  19, 1A, 1B, 1C, 1D, 1E, 1F, 20
        [ 0,  0,  0,  0,  0,  0,  0,  0],
    ];

    if (data == "0100") {
        pins[1][3] = 1;
        pins[1][4] = 1;
        pins[1][5] = 1;
        pins[1][6] = 1;
    }
    if (data == "0120") {
        pins[0][1] = 1;
    }
    if (data == "0140" || data == "0160" || data == "0180" || data == "01A0" || data == "01C0") {
        return this.writeNext('NO DATA');
    }

    var bytes = [];
    for (var i = 0; i < pins.length; i++) {
        var byte = 0;

        for (var b = 0; b < pins[i].length; b++) {
            if (pins[i][b] == 1) {
                byte ^= 1 << b
            }
        }

        bytes.push(byte);
    }

    var byteString = ['>41', data.substring(2, 4)];

    for (var i = 0; i < bytes.length; i++) {
        var s = bytes[i].toString(16);
        if (s.length == 1) {
            s = '0'+s;
        }

        byteString.push(s);
    }

    this.writeNext(byteString.join(''));
}
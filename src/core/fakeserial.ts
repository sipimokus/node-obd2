/**
 * OBD protocol emulated serial port
 *
 * Source and inspiring:
 * https://github.com/matejkramny/nodejs-obd-parser
 *
 */
/// <reference path="../typings/tsd.d.ts"/>

let 		util = require('util');
import 		events	= require('events');

let commands = [];
require('fs').readdirSync(__dirname + '/../data/pid').forEach(function (e)
{
	commands.push(require(__dirname + '/../data/pid/' + e));
});

let debug = require("debug")("OBD2.Core.FakeSerial");

export namespace OBD2
{
	export module Core
	{
		export class FakeSerial extends events.EventEmitter
		{
			private opened : boolean = false;

			private modes =
			{
				L: 1,
				E: 1
			};

			constructor( fakePort? : string, fakeOptions? : any, openImmediately? : boolean )
			{
				super();

				if ( openImmediately === true || typeof openImmediately === "undefined" )
				{
					process.nextTick( () =>
					{
						this.emit('open');
						this.opened = true;
					});
				}

			}

			public open( cb )
			{
				if ( !this.opened )
				{
					this.emit('open');
					this.opened = true;
				}

				cb();

			}

			public close( cb )
			{
				if ( this.opened )
				{
					this.emit('close');
					this.opened = false;
				}

				cb();

			}

			public isOpen = () =>
			{
				return this.opened;
			};

			public writeNext = ( data : any ) =>
			{
				process.nextTick( () =>
				{
					this.emit('data', data + "\r\r");
				});
			};

			public drain = ( data : any ) =>
			{
				this.write( data );
			};

			public write = ( data : any ) =>
			{
				data = data.replace("\n", "").replace("\r", "");

				if (data.substring(0, 2) == "AT") {
					var mode = data.substring(3, 4);
					for ( let m in this.modes )
					{
						if (mode == m)
						{
							this.modes[m] = 0;

							if (data.substring(4, 5) == "1")
							{
								this.modes[m] = 1;
							}
						}
					}
				}

				if (this.modes.E) {
					// echo
					//this.writeNext(data);
				}

				if (data == "AT E0")
				{
					this.writeNext(data);

					return;
				}

				if (data == "0100" || data == "0120" || data == "0140" || data == "0160" || data == "0180" || data == "01A0" || data == "01C0")
				//if (data == "0100" || data == "0120")
				{
					return this.findSupportedPins(data);
				}

				if (data.substring(0, 2) != "01")
				{
					return this.writeNext('?');
				}

				var cmd = data.substring(2, 4);
				for (var i = 0; i < commands.length; i++)
				{
					if (commands[i].pid == cmd)
					{
						if ( typeof commands[i].testResponse == "function" )
						{
							var res = commands[i].testResponse(data).toString(16);
							if (res.length % 2 == 1)
							{
								res = '0' + res;
							}

							return this.writeNext( ('>41' + cmd + '' + res).toUpperCase() );
						}
					}
				}

				return this.writeNext('?');
			};

			public findSupportedPins = ( data : any ) =>
			{
				// writes 4 bytes.
				// with bits encoded as 'supported' pins

				var pins =
				[
					//  01, 02, 03, 04, 05, 06, 07, 08
					[ 0,  0,  0,  0,  0,  0,  0,  0],
					//  09, 0A, 0B, 0C, 0D, 0E, 0F, 10
					[ 0,  0,  0,  0,  0,  0,  0,  0],
					//  11, 12, 13, 14, 15, 16, 17, 18
					[ 0,  0,  0,  0,  0,  0,  0,  0],
					//  19, 1A, 1B, 1C, 1D, 1E, 1F, 20
					[ 0,  0,  0,  0,  0,  0,  0,  0],
					[ 0,  0,  0,  0,  0,  0,  0,  0],
				];

				if (data == "0100")
				{
					pins[3][0] = 1;
					pins[1][3] = 1;
					pins[1][4] = 1;
					pins[1][5] = 1;
					pins[1][6] = 1;
				}
				if (data == "0120")
				{
					pins[3][0] = 1;
				}
				if (data == "0140")
				{
					pins[3][0] = 1;
				}
				if (data == "0160")
				{
					//pins[3][0] = 1;
				}
				if ( data == "0180" || data == "01A0" || data == "01C0")
				{
					return this.writeNext('NO DATA');
				}

				var bytes = [];
				for (var i = 0; i < pins.length; i++)
				{
					var byte = 0;

					for (var b = 0; b < pins[i].length; b++)
					{
						if (pins[i][b] == 1) {
							byte ^= 1 << b
						}
					}

					bytes.push(byte);
				}

				var byteString = ['>41', data.substring(2, 4)];

				for (var i = 0; i < bytes.length; i++)
				{
					var s = bytes[i].toString(16);
					if (s.length == 1) {
						s = '0'+s;
					}

					byteString.push(s);
				}

				return this.writeNext(byteString.join(''));

			};

		}

	}

}

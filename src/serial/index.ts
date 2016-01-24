/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="bluetooth.ts"/>
/// <reference path="fake.ts"/>
/// <reference path="usb.ts"/>

import _bluetooth  = require("./bluetooth");
import _fakeserial = require("./fake");
import _usbserial  = require("./usb");

var debug = require("debug")("OBD2.Serial.Main");

export namespace OBD2
{
	export module Serial
	{
		export class Main
		{
			Serial : any;

			/**
			 * Serial declare
			 *
			 * @param type
			 * @returns {any}
			 */
			constructor( type: string )
			{
				debug("Serial type: " + type);

				this.Serial = this.selectSerial( type );

				if ( !this.Serial )
				{
					throw new Error("Unknown connection type: " + type);
				}

				this._eventsHandler();

				return this.Serial;

			}

			/**
			 * Events handler
			 *
			 * @private
			 */
			private _eventsHandler = () =>
			{
				this.Serial.on("ready", () =>
				{
					debug("Serial port ready");
				});

				this.Serial.on("open", ( port ) =>
				{
					debug("Serial port opened: " +  port );
				});

				this.Serial.on("close", ( port ) =>
				{
					debug("Serial port closed: " +  port );
				});

				this.Serial.on("error", ( error, port ) =>
				{
					debug("Serial port error: " +  port );
				});

				this.Serial.on("data", ( data, port ) =>
				{
					debug("Serial port data: " +  data );
				});

			};

			/**
			 * Connection class selector
			 *
			 * @param type
			 * @returns {any}
			 */
			private selectSerial( type: string )
			{
				switch ( type.toLowerCase() )
				{
					case 'bt':
					case 'bluetooth':

						return new _bluetooth.OBD2.Serial.Bluetooth();

						break;

					case 'fake':
					case 'fakeserial':

						return new _fakeserial.OBD2.Serial.Fake();

						break;

					case 'usb':
					case 'serial':

						return new _usbserial.OBD2.Serial.Usb();

						break;
				}

				return null;
			}

		}

	}

}

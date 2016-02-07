/// <reference path="../typings/main.d.ts"/>
/// <reference path="bluetooth.ts"/>
/// <reference path="fake.ts"/>
/// <reference path="usb.ts"/>

import _blueTooth  = require("./bluetooth");
import _fakeSerial = require("./fake");
import _usbSerial  = require("./usb");

var debug = require("debug")("OBD2.Serial.Main");

export namespace OBD2
{
	export namespace Serial
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
			constructor( type: string, port : string, options : any )
			{
				debug("Serial type: " + type);
				debug("Serial port: " + port);

				this.Serial = this.selectSerial( type, port, options );

				if ( !this.Serial )
				{
					throw new Error("Unknown connection type: " + type);
				}

				return this.Serial;

			}


			getSerialInstance() : any
			{
				return this.Serial;
			}

			/**
			 * Connection class selector
			 *
			 * @param type
			 * @returns {any}
			 */
			private selectSerial( type: string, port : string, options : any )
			{
				switch ( type.toLowerCase() )
				{
					case "bt":
					case "bluetooth":

						return new _blueTooth.OBD2.Serial.Bluetooth( port, options );

						break;

					case "fake":
					case "fakeserial":

						return new _fakeSerial.OBD2.Serial.Fake( port, options );

						break;

					case "usb":
					case "serial":

						return new _usbSerial.OBD2.Serial.Usb( port, options );

						break;

					default:
						return undefined;
				}

			}

		}

	}

}

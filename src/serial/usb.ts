/// <reference path="../typings/main.d.ts"/>

let SerialPort : any = require( "serialport" );
import baseSerial    = require("./base");

export namespace OBD2
{
	export namespace Serial
	{
		export class Usb extends baseSerial.OBD2.Serial.Base
		{
			/**
			 * Constructor
			 *
			 * @param port
			 * @param options
			 */
			constructor( port : string, options? : any )
			{
				super();

				this.setPort( port );
				this.setOptions( options );
				this.setSerial(
					new SerialPort( port, options )
				);

			}

		}

	}

}

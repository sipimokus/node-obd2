/// <reference path="../typings/tsd.d.ts"/>

let SerialPort : any	= require('serialport').SerialPort;
import 		events	= require('events');
import baseSerial	= require('./base');

export namespace OBD2
{
	export namespace Serial
	{
		export class Usb
		extends baseSerial.OBD2.Serial.Base//, events.EventEmitter
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
					new SerialPort( port, options, false )
				);

			}

		}

	}

}

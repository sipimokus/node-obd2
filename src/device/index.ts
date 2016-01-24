/// <reference path="../typings/tsd.d.ts"/>

/// <reference path="../serial/index.ts"/>

let path  = require('path');

let debug = require("debug")("OBD2.Device.Main");

export namespace OBD2
{
	export module Device
	{
		export class Main
		{
			Device : any;
			_name  : string;

			constructor( deviceName? : string )
			{
				if ( deviceName )
				{
					this.loadDevice( deviceName );
				}

				debug("Ready")
			}

			public connect( Serial : OBD2_SerialInterface, cb ? : any )
			{
				debug("Connecting");

				this.Device.connect( Serial, () =>
				{
					debug("Connected");

					// Callback
					cb();
				});
			}

			public disconnect( Serial : OBD2_SerialInterface )
			{

			}

			public loadDevice( deviceName : string )
			{
				this._name  = deviceName.toLowerCase();
				this.Device = new (require(
					path.join( __dirname, this._name, "index" )
				)).OBD2.Device.ELM327();

				debug("Loaded device: " + this._name);
			}

			public getDevice() : any
			{
				return this.Device;
			}

			public getDeviceName() : string
			{
				return this._name;
			}

			public setDevice( deviceObject : any ) : void
			{
				this.Device = deviceObject;
			}
		}

	}

}

/// <reference path="../typings/index.d.ts"/>

/// <reference path="../serial/index.ts"/>

let path  = require("path");

let debug = require("debug")("OBD2.Device.Main");

export namespace OBD2
{
	export namespace Device
	{
		export class Main
		{
			private Device : any;
			private _name  : string;

			constructor( deviceName? : string )
			{
				if ( deviceName )
				{
					this.loadDevice( deviceName );
				}

				debug("Ready");
			}

			public connect( Serial : any, cb ? : any )
			{
				debug("Connecting");

				this.Device.connect( Serial, () =>
				{
					debug("Connected");

					// Callback
					cb();
				});
			}

			public disconnect( Serial : any )
			{
				//
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

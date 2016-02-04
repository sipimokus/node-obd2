/// <reference path="../typings/tsd.d.ts"/>

let fs		= require('fs');
let path	= require('path');

let debug = require("debug")("OBD2.Core.DTC");

export namespace OBD2
{
	export module Core
	{
		export class DTC
		{
			list	: any = [];

			constructor()
			{
				this._loadDtcList();

				debug("Ready");
			}

			private _loadDtcList = () =>
			{
				debug("Loading list");

				let basePath = path.join( __dirname, "..", "data", "dtc" );

				try
				{
					if ( fs.statSync( basePath ) )
					{
						fs.readdirSync( basePath ).forEach( ( file : string ) =>
						{
							this.list.push( require( path.join( basePath, file ) ) );
						});
					}
				}
				catch ( e )
				{
					debug("[ERROR] Data directory not found!");
				}

				debug("Loaded count: " + this.list.length);
			};

			public getList = () =>
			{
				return this.list;
			};

			public getByName = ( slug : string ) =>
			{
			};

			public getByPid = ( pid : string, mode? : string ) =>
			{
			};

		}

	}

}

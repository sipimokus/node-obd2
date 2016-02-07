/// <reference path="../typings/main.d.ts"/>

import fs	= require("fs");
import path	= require("path");

let debug	: debug.IDebug = require("debug")("OBD2.Core.DTC");

export namespace OBD2
{
	export namespace Core
	{
		export class DTC
		{
			private list	: any = [];

			constructor()
			{
				this._loadDtcList();

				debug("Ready");
			}

			public _loadDtcList( basePath? : string )
			{
				debug("Loading list");

				basePath = basePath
					? basePath
					: path.join( __dirname, "..", "data", "dtc" )
				;

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
			}

			public getList()
			{
				return this.list;
			}

			public getByName( slug : string )
			{
				//
			}

			public getByPid( pid : string, mode? : string )
			{
				//
			}

		}

	}

}

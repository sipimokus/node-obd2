/// <reference path="../typings/tsd.d.ts"/>

let fs		= require('fs');
let path	= require('path');

let debug = require("debug")("OBD2.Core.PID");

export namespace OBD2
{
	export module Core
	{
		export class PID
		{
			list	: any = [];
			listEcu : any = [];

			/**
			 * Constructor
			 */
			constructor()
			{
				this._loadPidList();

				debug("Ready");
			}


			/**
			 * Loading PID details from data directory
			 *
			 * @private
			 */
			private _loadPidList = () =>
			{
				debug("Loading list");

				let basePath = path.join( __dirname, "..", "data", "pid" );

				try
				{
					if ( fs.statSync( basePath ) )
					{
						fs.readdirSync( basePath ).forEach( ( file : string ) =>
						{
							let tmpPidObject = require( path.join( basePath, file ) );

							this.list.push( tmpPidObject );

						});
					}
				}
				catch ( e )
				{
					debug("[ERROR] Data directory not found!");
				}

				debug("Loaded count: " + this.list.length);
			};


			/**
			 * PID support command parser, and appender
			 *
			 * @param returnType
			 * @param returnValue
			 * @returns {boolean}
			 * @private
			 */
			public _loadPidEcuList = ( returnType, returnValue ) : boolean =>
			{
				let decodeList =
				{
					0: [0,0,0,0],
					1: [0,0,0,1],
					2: [0,0,1,0],
					3: [0,0,1,1],
					4: [0,1,0,0],
					5: [0,1,0,1],
					6: [0,1,1,0],
					7: [0,1,1,1],
					8: [1,0,0,0],
					9: [1,0,0,1],
					A: [1,0,1,0],
					B: [1,0,1,1],
					C: [1,1,0,0],
					D: [1,1,0,1],
					E: [1,1,1,0],
					F: [1,1,1,1]
				};

				let pidCommands =
				{
					"pidsupp0": "00",
					"pidsupp2": "20",
					"pidsupp4": "40",
					"pidsupp6": "60",
					"pidsupp8": "80",
					"pidsuppa": "A0",
					"pidsuppc": "C0"
				};

				var hexNum;
				var defNum = 0;
				var tmpPid : string = '';
				let tmpFind: boolean = false;

				// pidsupp0, pidsupp2, ...
				if ( typeof pidCommands[ returnType ] == "undefined" )
					return false;

				// Start list, pl [00-19, 20-39, 40-59, ...]
				defNum = this._hex2dec( pidCommands[ returnType ] );

				// Hexadecimal value
				// Pl.: BE1FA813
				returnValue = String(returnValue);


				// Átfutunk a bejövő számon
				for ( var i = 0; i < returnValue.length; i++ )
				{

					hexNum = this._hex2dec( returnValue.charAt(i) );

					// Megnézzük melyik PID támogatott
					for ( var j = 0; j < 4; j++ )
					{
						// Check PID is supported
						if ( decodeList[ returnValue.charAt(i) ][ j ] == 1 )
						{
							// Pl.: 0*4 + 1*1 = 01
							// 2*4 + 0*3 = 11 = 0B
							// defNum is a shifting number
							// Pl: 20 + 0*4 + 1 = 21

							tmpPid = this._dec2hex( defNum + (i*4) + (j+1) );

							if ( tmpPid.length === 1 )
								tmpPid = '0' + tmpPid;

							// Push supperted PID
							this.listEcu.push( tmpPid );
							tmpFind = true;

						}
					}
				}

				return tmpFind;

			};


			/**
			 * Converting DEC to HEX number
			 *
			 * @param number
			 * @returns {String|any}
			 * @private
			 */
			private _dec2hex = ( number ) : string =>
			{
				if (number < 0)
				{
					number = 0xFFFFFFFF + number + 1;
				}

				number = String( number.toString(16).toUpperCase() );

				if ( number.length === 1 )
					number = '0' + number;

				return number;
			};


			/**
			 * Converting HEX to DEC number
			 *
			 * @param number
			 * @returns {number}
			 * @private
			 */
			private _hex2dec = ( number ) : number =>
			{
				return parseInt( number , 16);
			};


			/**
			 * Get supported ECU PID list
			 *
			 * @returns {any}
			 */
			public getListECU()
			{
				return this.listEcu.filter( ( value, index, self ) =>
				{
					return self.indexOf( value ) === index;
				});
			}


			/**
			 * Get PID details list
			 *
			 * @returns {any}
			 */
			public getList = () =>
			{
				return this.list;
			};


			/**
			 * Get PID details by name/slug
			 *
			 * @param slug
			 * @returns {any}
			 */
			public getByName = ( slug : string ) =>
			{
				for( let index in this.list )
				{
					if (
						typeof this.list[ index ].name === "undefined"
					)
					{
						continue;
					}

					if ( this.list[ index ].name.toLowerCase() === slug.toLowerCase() )
					{
						return this.list[ index ];
					}
				}

				return null;
			};


			/**
			 * Get PID details by pid/mode
			 *
			 * @param pid
			 * @param mode
			 * @returns {any}
			 */
			public getByPid = ( pid : string, mode? : string ) =>
			{
				mode = !mode ? "09" : mode;

				for( let index in this.list )
				{
					if (
						typeof this.list[ index ].pid === "undefined"
					 || typeof this.list[ index ].mode === "undefined"
					)
					{
						continue;
					}

					if (
						this.list[ index ].pid.toLowerCase()  === pid.toLowerCase()
					 && this.list[ index ].mode.toLowerCase() === mode.toLowerCase()
					)
					{
						return this.list[ index ];
					}
				}

				return null;
			};


		}

	}

}

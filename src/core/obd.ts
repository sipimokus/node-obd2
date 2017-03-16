/// <reference path="../typings/main.d.ts"/>

import {createSecureContext} from "tls";
let debug : debug.IDebug = require( "debug" )( "OBD2.Core.OBD" );

export namespace OBD2
{
	export namespace Core
	{
		export class OBD
		{
			private _pidList 		: any;
			private _dataReceived 	: string;
			private _deviceCommands	: any = [
				"?",
				"OK",
				"SEARCHING",
				"SEARCHING...",
				"UNABLE TO CONNECT",
				"STOPPED",
				"NO DATA",
				"CAN ERROR",
				"ERROR",
				"BUS INIT",
			];
			// https://www.scantool.net/forum/index.php?topic=6927.0

			constructor( pidList : any )
			{
				this._pidList		 = pidList;
				this._dataReceived 	 = "";

				debug( "Ready" );
			}

			public parseDataStreamReady(messageString, cb) {
				debug( "   Serial data line : " + messageString );

				let forString, arrayOfCommands;

				if ( messageString === "" )
				{
					return;
				}

				let reply = this.parseCommand( messageString );

				if ( this._deviceCommands.indexOf( messageString ) > -1 )
				{
					cb( "ecu", reply, messageString );
				}
				else
				{

					if ( typeof reply.value === "undefined" || !reply.name || (!reply.mode && !reply.pid) )
					{
						cb( "bug", reply, messageString );
					}
					else if ( reply.mode === "41" )
					{
						cb( "pid", reply, messageString );
					}
					else if ( reply.mode === "43" )
					{
						cb( "dtc", reply, messageString );
					}

				}

			}

			private parseDataLCommands( dataString: string, splitChar: string, cb: any )
			{
				let firstData  = "",
					secondData = "",
					tmpString;

				if ( !splitChar || !dataString || typeof dataString !== "string" )
				{
					return;
				}

				if ( dataString.indexOf(splitChar) > -1 )
				{
					tmpString  = dataString.split(splitChar);

					for ( let i = 0; i < tmpString.length; i++ )
					{
						if ( tmpString[i] === "\r" ||
							 tmpString[i] === "\n" ||
							 tmpString[i] === splitChar ||
							 !tmpString[i] )
						{
							continue;
						}

						if ( firstData === "" ) {
							firstData = tmpString[i];
						} else {
							secondData+= tmpString[i];
						}
					}

					this.parseDataStreamReady(firstData, cb);
					dataString = this._dataReceived = secondData;
				}

				return dataString;
			}


			/**
			 * Parse Serial data stream to PID details
			 *
			 * @param data
			 * @param cb
			 */
			public parseDataStream( data : any, cb : any ) {
				let currentString, forString, arrayOfCommands, dataString;
				let modifiedSuccess = false;
				let delimiters = [">", "\r", "..."];

				// making sure it's a utf8 string
				dataString = data.toString("utf8");
				currentString = this._dataReceived + dataString;

				for ( let i = 0; i < delimiters.length; i++ ) {
					if ( typeof currentString === "string" && currentString.indexOf(delimiters[i]) > -1 ) {
						currentString = this.parseDataLCommands( currentString, delimiters[i], cb );
						modifiedSuccess = true;
					}
				}

				if (!modifiedSuccess) {
					this._dataReceived = currentString;
				}
			}


			/**
			 * Parses a hexadecimal string to a reply object. Uses PIDS.
			 *
			 * @param {string} hexString Hexadecimal value in string that is received over the serialport.
			 * @return {Object} reply - The reply.
			 * @return {string} reply.value - The value that is already converted. This can be a PID converted answer or "OK" or "NO DATA".
			 * @return {string} reply.name - The name. --! Only if the reply is a PID.
			 * @return {string} reply.mode - The mode of the PID. --! Only if the reply is a PID.
			 * @return {string} reply.pid - The PID. --! Only if the reply is a PID.
			 */
			public parseCommand( hexString : string )
			{
				let reply : obd2.OBD2_IReplyParseCommand = {
						value : undefined,
						name  : undefined,
						mode  : undefined,
						pid   : undefined,
						min   : undefined,
						max   : undefined,
						unit  : undefined,
					},
					byteNumber,
					valueArray; //New object

				// No data or OK is the response.
				if ( hexString === "NO DATA" || hexString === "OK" || hexString === "?" )
				{
					reply.value = hexString;
					return reply;
				}

				hexString = hexString.replace( / /g, "" ); //Whitespace trimming //Probably not needed anymore?
				valueArray = [];

				for ( byteNumber = 0; byteNumber < hexString.length; byteNumber += 2 )
				{
					valueArray.push( hexString.substr( byteNumber, 2 ) );
				}

				// PID mode
				if ( valueArray[ 0 ] === "41" )
				{
					reply.mode = valueArray[ 0 ];
					reply.pid  = valueArray[ 1 ];

					for ( let i = 0; i < this._pidList.length; i++ )
					{
						if ( this._pidList[ i ].pid === reply.pid )
						{
							let numberOfBytes = this._pidList[ i ].bytes;

							reply.name = this._pidList[ i ].name;
							reply.min  = this._pidList[ i ].min;
							reply.max  = this._pidList[ i ].max;
							reply.unit = this._pidList[ i ].unit;

							// Use static parameter (performance up, usually)
							switch ( numberOfBytes )
							{
								case 1:
									reply.value = this._pidList[ i ].convertToUseful(
										valueArray[ 2 ]
									);
									break;

								case 2:
									reply.value = this._pidList[ i ].convertToUseful(
										valueArray[ 2 ],
										valueArray[ 3 ]
									);
									break;

								case 4:
									reply.value = this._pidList[ i ].convertToUseful(
										valueArray[ 2 ],
										valueArray[ 3 ],
										valueArray[ 4 ],
										valueArray[ 5 ]
									);
									break;

								case 8:
									reply.value = this._pidList[ i ].convertToUseful(
										valueArray[ 2 ],
										valueArray[ 3 ],
										valueArray[ 4 ],
										valueArray[ 5 ],
										valueArray[ 6 ],
										valueArray[ 7 ],
										valueArray[ 8 ],
										valueArray[ 9 ]
									);
									break;

								// Special length, dynamic parameters
								default:
									reply.value = this._pidList[ i ].convertToUseful.apply(
										this,
										valueArray.slice( 2, 2 + parseInt( numberOfBytes, 10 ) )
									);
									break;
							}

							//Value is converted, break out the for loop.
							break;
						}
					}

				}

				// DTC mode
				else if ( valueArray[ 0 ] === "43" )
				{
					reply.mode = valueArray[ 0 ];
					for ( let i = 0; i < this._pidList.length; i++ )
					{
						if ( this._pidList[ i ].mode === "03" )
						{
							reply.name  = this._pidList[ i ].name;
							reply.value = this._pidList[ i ].convertToUseful(
								valueArray[ 1 ],
								valueArray[ 2 ],
								valueArray[ 3 ],
								valueArray[ 4 ],
								valueArray[ 5 ],
								valueArray[ 6 ]
							);
						}
					}

				}

				return reply;
			}

		}

	}

}

/// <reference path="../typings/tsd.d.ts"/>

let fs		= require('fs');
let path	= require('path');

let debug = require("debug")("OBD2.Core.OBD");

export namespace OBD2
{
	export module Core
	{
		export class OBD
		{
			_pidsList  		: any	 = [];
			_dataReceived 	: string = "";
			_deviceCommands : any = [
				"OK",
				"SEARCHING",
				"SEARCHING...",
				"UNABLE TO CONNECT",
				"STOPPED",
				"NO DATA",
				"CAN ERROR",
				"ERROR",
				"BUS INIT"

			]; // https://www.scantool.net/forum/index.php?topic=6927.0

			constructor( pidList : any )
			{
				this._pidsList = pidList;

				debug("Ready");
			}

			public dataToPid()
			{

			}

			public parseDataStream( data : any, cb : any )
			{
				var currentString, forString, indexOfEnd, arrayOfCommands;

				// making sure it's a utf8 string
				currentString = this._dataReceived + data.toString('utf8');

				arrayOfCommands = currentString.split('>');

				//console.log(arrayOfCommands, currentString, arrayOfCommands[0] == "SEARCHING...\r\r", arrayOfCommands[0] == "SEARCHING...\\r\\r");

				if( arrayOfCommands.length < 2 )
				{
					this._dataReceived = arrayOfCommands[0];
					console.log("this._dataReceived", this._dataReceived);
				}
				else
				{
					console.log("data._dataReceived", this._dataReceived);
					for ( let commandNumber = 0; commandNumber < arrayOfCommands.length; commandNumber++ )
					{
						forString = arrayOfCommands[commandNumber];

						if( forString === '' )
						{
							continue;
						}

						var multipleMessages = forString.split('\r');
						for ( var messageNumber = 0; messageNumber < multipleMessages.length; messageNumber++ )
						{
							var messageString = multipleMessages[messageNumber];

							if(messageString === '')
							{
								continue;
							}

							var reply;

							if ( this._deviceCommands.indexOf(messageString) > -1 )
							{
								cb("ecu", reply, messageString);
							}
							else
							{
								reply = this.parseCommand(messageString);

								if( !reply.value || !reply.name || (!reply.mode && !reply.pid) )
								{
									cb("bug", reply, messageString);
								}
								else if ( reply.mode == "41" )
								{
									cb("pid", reply, messageString);
								}
								else if( reply.mode == "43" )
								{
									cb("dct", reply, messageString);
								}


							}

							this._dataReceived = "";

						}

					}

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
				var reply = {
						value : null,
						name  : null,
						pid   : null,
						mode  : null
					},
					byteNumber,
					valueArray; //New object

				// No data or OK is the response.
				if ( hexString === "NO DATA" || hexString === "OK" || hexString === "?" )
				{
					reply.value = hexString;
					return reply;
				}

				hexString = hexString.replace(/ /g, ''); //Whitespace trimming //Probably not needed anymore?
				valueArray = [];

				for (byteNumber = 0; byteNumber < hexString.length; byteNumber += 2)
				{
					valueArray.push(hexString.substr(byteNumber, 2));
				}

				// PID mode
				if (valueArray[0] === "41")
				{
					reply.mode = valueArray[0];
					reply.pid = valueArray[1];

					for (var i = 0; i < this._pidsList.length; i++)
					{
						if ( this._pidsList[i].pid == reply.pid )
						{
							var numberOfBytes = this._pidsList[i].bytes;

							reply.name  = this._pidsList[i].name;

							// Use static parameter (performance up, usually)
							switch ( numberOfBytes )
							{
								case 1:
									reply.value = this._pidsList[i].convertToUseful( valueArray[2] );
									break;

								case 2:
									reply.value = this._pidsList[i].convertToUseful( valueArray[2], valueArray[3] );
									break;

								case 4:
									reply.value = this._pidsList[i].convertToUseful( valueArray[2], valueArray[3], valueArray[4], valueArray[5] );
									break;

								case 8:
									reply.value = this._pidsList[i].convertToUseful( valueArray[2], valueArray[3], valueArray[4], valueArray[5], valueArray[6], valueArray[7], valueArray[8], valueArray[9] );
									break;

								// Special length, dynamic parameters
								default:
									reply.value = this._pidsList[i].convertToUseful.apply( this, valueArray.slice( 2, 2 + parseInt( numberOfBytes ) ) );
									break;
							}

							//Value is converted, break out the for loop.
							break;
						}
					}

				}

				// DTC mode
				else if ( valueArray[0] === "43" )
				{
					reply.mode = valueArray[0];
					for ( let i = 0; i < this._pidsList.length; i++ )
					{
						if( this._pidsList[i].mode == "03" )
						{
							reply.name  = this._pidsList[i].name;
							reply.value = this._pidsList[i].convertToUseful( valueArray[1], valueArray[2], valueArray[3], valueArray[4], valueArray[5], valueArray[6] );
						}
					}

				}

				return reply;
			}

		}

	}

}

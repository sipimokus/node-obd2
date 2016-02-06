/// <reference path="../typings/tsd.d.ts"/>

import 		events	= require('events');

var debug = require("debug")("OBD2.Serial.Base");
//var debug = console.log;

export namespace OBD2
{
	export module Serial
	{
		export class Base
		extends events.EventEmitter
		implements OBD2_SerialInterface
		{
			private Serial	: any;

			private port	: string;
			private options	: any;
			private opened	: boolean;


			/**
			 * Constructor
			 */
			constructor()
			{
				super();

				this.opened	  = false;

				this.emit( 'ready' );
			}


			onData = ( callBack : any ) =>
			{
				this.Serial.on( "data", callBack );
			};

			/**
			 * Serial port connect
			 */
			connect( callBack : any )
			{
				this.Serial.open( ( error ) =>
				{
					this.opened = !!(typeof this.Serial.isOpen === "function"
						? this.Serial.isOpen()
						: this.Serial.isOpen
					);

					if ( typeof callBack === "function" )
					{
						callBack();
					}

				});
			}


			/**
			 * Serial port disconnect
			 */
			disconnect( callBack : any )
			{
				this.Serial.close( ( error ) =>
				{
					this.opened = !!(typeof this.Serial.isOpen === "function"
						? this.Serial.isOpen()
						: this.Serial.isOpen
					);

					if ( typeof callBack === "function" )
					{
						callBack();
					}

				});
			}


			/**
			 *
			 * Serial data drain
			 *
			 * @param data
			 * @param callBack
			 */
			drain( data : string, callBack : any )
			{
				// Serial is opened
				if ( this.opened )
				{

					// Try write data
					try
					{
						this.emit("write", data);
						this.Serial.write( data, ( error ) =>
						{
							if ( typeof callBack === "function" )
							{
								this.Serial.drain( callBack );
							}
						});
					}
					catch ( exceptionError )
					{
						debug('Error while writing, connection is probably lost.');
						debug( exceptionError );
					}
				}
			}


			/**
			 * Serial data write
			 *
			 * @param data
			 * @param callBack
			 */
			write( data : string, callBack : any )
			{
				// Serial is opened
				if ( this.opened )
				{

					// Try write data
					try
					{
						this.emit("write", data);
						this.Serial.write( data, ( error ) =>
						{
							if ( typeof callBack === "function" )
							{
								callBack();
							}
						});
					}
					catch ( exceptionError )
					{
						debug('Error while writing, connection is probably lost.');
						debug( exceptionError );
					}
				}
			}


			/**
			 * Serial port instance set
			 *
			 * @param serial
			 */
			setSerial( serial : any ) : void
			{
				this.Serial = serial;
				this._eventHandlers();
			}


			/**
			 * Serial port instance get
			 *
			 * @returns {any}
			 */
			getSerial() : any
			{
				return this.Serial;
			}


			/**
			 * Set serial port
			 *
			 * @param port
			 */
			setPort( port : string ) : void
			{
				this.port = port;
			}


			/**
			 * Get serial port
			 *
			 * @returns {string}
			 */
			getPort() : string
			{
				return this.port;
			}


			/**
			 * Set serial options
			 *
			 * @param options
			 */
			setOptions( options : any ) : void
			{
				this.options = options;
			}


			/**
			 * Get serial options
			 *
			 * @returns {any}
			 */
			getOptions() : any
			{
				return this.options;
			}


			/**
			 * Get serial port is opened
			 *
			 * @returns {boolean}
			 */
			isOpen() : boolean
			{
				return this.opened;
			}


			/**
			 * Shared events handling
			 *
			 * @private
			 */
			_eventHandlers()
			{
				this.Serial.on("ready", () =>
				{
					debug("Serial port ready");
				});

				this.Serial.on("open", ( port ) =>
				{
					debug("Serial port open : " +  port );
				});

				this.Serial.on("close", ( port ) =>
				{
					debug("Serial port close: " +  port );
				});

				this.Serial.on("error", ( error, port ) =>
				{
					debug("Serial port error: " +  port );
				});

				this.Serial.on("data", ( data, port ) =>
				{
					data = data.replace(/(?:\r\n|\r|\n)/g, '');

					this.emit("data", data);
					debug("Serial port data : " +  data );
				});

				this.on("write", ( data, port ) =>
				{
					data = data.replace(/(?:\r\n|\r|\n)/g, '');

					debug("Serial port write: " +  data );
				});

			}

		}

	}

}

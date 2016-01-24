/// <reference path="../typings/tsd.d.ts"/>

let SerialPort	= require('serialport').SerialPort;
import events	= require('events');

export namespace OBD2
{
	export namespace Serial
	{
		export class Fake extends events.EventEmitter implements OBD2_SerialInterface
		{
			options : any;
			port : string;
			Serial : any;

			constructor()
			{
				super();
			}

			connect( port : string, options? : any )
			{
				this.port    = port;
				this.options = options;
				//this.Serial  = new SerialPort( this.port, this.options );
				this.Serial = new (require('../../fakeserial'))();

				this._eventHandler();

				this.emit( 'ready' );
			}


			disconnect()
			{
				this.Serial.close();
			}

			write( data : string ) : void
			{
				try
				{
					this.Serial.write( data );
				}
				catch (err)
				{
					console.log('Error while writing: ' + err);
					//debug('OBD-II Listeners deactivated, connection is probably lost.');
				}
			}

			read()
			{

			}

			private _eventHandler()
			{
				this.Serial.on( 'open', () =>
				{
					this.emit( 'open', this.port );
				});

				this.Serial.on( 'close', () =>
				{
					this.emit( 'close', this.port );
				});

				this.Serial.on( 'error', ( error ) =>
				{
					this.emit( 'close' );
					this.emit( 'error', error, this.port );
				});

				this.Serial.on( 'data', ( data ) =>
				{
					this.emit( 'data', data, this.port );
				});

			}

		}

	}

}

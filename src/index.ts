/// <reference path="typings/main.d.ts"/>

/// <reference path="core/dtc.ts"/>
/// <reference path="core/pid.ts"/>
/// <reference path="core/obd.ts"/>
/// <reference path="core/ticker.ts"/>
/// <reference path="device/index.ts"/>
/// <reference path="serial/index.ts"/>

import _dtc		= require('./core/dtc');
import _pid		= require('./core/pid');
import _obd		= require('./core/obd');
import _ticker	= require('./core/ticker');
import _device	= require('./device/index');
import _serial	= require('./serial/index');

const  DTC		= _dtc.OBD2.Core.DTC;
const  PID		= _pid.OBD2.Core.PID;
const  OBD		= _obd.OBD2.Core.OBD;
const  Ticker	= _ticker.OBD2.Core.Ticker;
const  Device	= _device.OBD2.Device.Main;
const  Serial	= _serial.OBD2.Serial.Main;

import events	= require('events');
const  debug 	: debug.IDebug = require("debug")("OBD2.Main");

export namespace OBD2
{
	export class Main extends events.EventEmitter
	{
		public DTC		: _dtc.OBD2.Core.DTC;
		public PID		: _pid.OBD2.Core.PID;
		public OBD		: _obd.OBD2.Core.OBD;
		public Ticker	: _ticker.OBD2.Core.Ticker;
		public Device	: _device.OBD2.Device.Main;
		public Serial	: obd2.OBD2_SerialInterface;

		_options : any;

		public constructor( options : any )
		{
			super();

			debug("Initializing");

			this._options = options;

			this.DTC	= new DTC();
			this.PID	= new PID();
			this.OBD	= new OBD( this.PID.getList() );
			this.Ticker	= new Ticker( this._options.delay );
			this.Device = new Device( this._options.device );
			this.Serial = new Serial( this._options.serial, this._options.port,
				{
					baudrate: this._options.baud
				});

			debug("Ready");
		}

		public start( callBack : any )
		{
			/*this.Serial.onData( ( data ) =>
			 {
			 console.log("data1", data);
			 });*/

			this.Serial.on( "data", ( data ) =>
			{
				this.OBD.parseDataStream( data, ( type, mess ) =>
				{
					this.emit( type, mess, data );
					this.emit("dataParsed", type, mess, data);
				});

				this.emit("dataReceived", data);

			});

			this.Serial.connect( () =>
			{
				this.Device.connect( this, () =>
				{


					/*this.Serial.getSerial().on("data", ( data ) =>
					 {
					 console.log("data2", data);
					 });*/

					callBack();
				});

			});

		}

		public sendAT( atCommand : string )
		{
			//atCommand = atCommand.replace(/" "/g, "");
			//atCommand = String(atCommand).replace(" ", "");

			this.Ticker.addItem( "AT", atCommand, false, ( next ) =>
			{
				this.Serial.drain( atCommand + '\r' );
				this.once("dataReceived", ( data ) =>
				{
					// Wait a bit
					setTimeout( next, 100 );
				});

			});

		}

		public listPID = ( callBack : any ) : void =>
		{
			var pidSupportList = ["00","20","40","60","80","A0","C0"];
			var pidSupportReal = [];


			if ( this.PID.getListECU().length > 0 )
			{
				callBack( this.PID.getListECU() );
			}
			else
			{
				this._tickListPID( pidSupportList, (a) =>
				{
					callBack( this.PID.getListECU() );
				});
			}

		};

		private _tickListPID( pidList : any, callBack : any ) : void
		{
			if ( pidList.length <= 0 )
			{
				callBack();
			}

			let cmdPid = pidList.shift();

			if ( this.PID.getListECU().length > 0 && this.PID.getListECU().indexOf( cmdPid ) < 0 )
			{
				callBack();
			}

			this.sendPID( cmdPid, "01", (mess, data) =>
			{
				if ( this.PID._loadPidEcuList( mess.name, mess.value ) )
				{
					this._tickListPID( pidList, callBack );
				}
				else
				{
					callBack();
				}
			});

		}


		/**
		 * Writing PID
		 *
		 * @param replies
		 * @param loop
		 * @param pidNumber
		 * @param pidMode
		 * @param callBack
		 */
		public writePID = ( replies : string, loop : boolean, pidNumber : string, pidMode? : string, callBack? : any ) : void =>
		{
			// Arguments
			if ( typeof pidMode === "function" )
			{
				callBack = pidMode;
				pidMode  = "01";
			}
			else
			{
				pidMode = !pidMode ? "01" : pidMode;
			}

			// Vars
			let pidData  : any 	 = this.PID.getByPid( pidNumber, pidMode );
			let sendData : string = "";
			replies = !replies ? "" : replies;

			// PID defined?
			if ( pidData )
			{
				// MODE + PID + (send/read)
				if ( pidData.pid !== "undefined" )
				{
					sendData = pidData.mode + pidData.pid + replies + '\r';
				}

				// Only mode send ( ex. DTC )
				else
				{
					sendData = pidData.mode + replies + '\r';
				}

			}

			// Undefined PID
			else
			{
				sendData = pidMode + pidNumber + replies + '\r' ;
			}

			// Add Ticker
			this.Ticker.addItem( "PID", sendData, !!loop, ( next, elem ) =>
			{
				// Timeout var for auto cleaning
				var itemSkip : any;

				// Send data
				if ( elem.fail % 20 == 0 )
				{
					this.Serial.drain( sendData );
				}

				// Detected parsed PID data
				this.once("pid", ( mess, data ) =>
				{
					if ( typeof callBack === "function" )
					{
						callBack( mess, data );
					}

					clearTimeout( itemSkip );
					itemSkip = null;

					next();
				});



				// Timeout timer
				itemSkip = setTimeout(()=>
				{
					// Fail to remove
					elem.fail++;

					// Auto remover, 60 loop wait, 4 sending try
					if ( this._options.cleaner && elem.fail > 60 )
					{
						this.Ticker.delItem( "PID", sendData );
					}

					next();

				}, this._options.delay );


				/*
				 // Direct callBack
				 if ( typeof callBack === "function" )
				 {
				 // Detected parsed PID data
				 this.once("pid", ( mess, data ) =>
				 {
				 callBack( mess, data );

				 clearTimeout( itemSkip );
				 delete itemSkip;

				 next();
				 });
				 }

				 // Without direct callback
				 else
				 {
				 // Auto remover, 100 loop wait
				 if ( this._options.cleaner )
				 {
				 // Timeout timer
				 itemSkip = setTimeout(()=>
				 {
				 // Fail to remove
				 elem.fail++;
				 console.log(elem.data, elem.fail);
				 if ( elem.fail == 100 )
				 {
				 this.Ticker.delItem( "PID", sendData );
				 }

				 next();

				 }, this._options.delay );
				 }

				 // Next Tick
				 next();
				 }
				 */
			});

		};

		/**
		 * Sending PID code
		 *
		 * @param pidNumber
		 * @param pidMode
		 * @param callBack
		 */
		public sendPID = ( pidNumber : string, pidMode? : string, callBack? : any ) : void =>
		{
			this.writePID( null, false, pidNumber, pidMode, callBack );
		};


		/**
		 * Reading PID code
		 *
		 * @param pidNumber
		 * @param pidMode
		 * @param callBack
		 */
		public readPID = ( pidNumber : string, pidMode? : string, callBack? : any ) : void =>
		{
			this.writePID( "1", true, pidNumber, pidMode, callBack );
		};

	}
}
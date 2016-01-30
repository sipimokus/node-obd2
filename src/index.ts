/// <reference path="typings/tsd.d.ts"/>

/// <reference path="core/dtc.ts"/>
/// <reference path="core/pid.ts"/>
/// <reference path="core/obd.ts"/>
/// <reference path="core/repeater.ts"/>
/// <reference path="serial/index.ts"/>

import _dtc		= require('./core/dtc');
import _pid		= require('./core/pid');
import _obd		= require('./core/obd');
import _repeat	= require('./core/repeater');
import _device	= require('./device/index');
import _serial	= require('./serial/index');

const  DTC		= _dtc.OBD2.Core.DTC;
const  PID		= _pid.OBD2.Core.PID;
const  OBD		= _obd.OBD2.Core.OBD;
const  Repeat	= _repeat.OBD2.Core.Repeater;
const  Device	= _device.OBD2.Device.Main;
const  Serial	= _serial.OBD2.Serial.Main;

import events	= require('events');
const  debug 	= require("debug")("OBD2.Main");

export namespace OBD2
{
	export class Main extends events.EventEmitter
	{
		public DTC		: _dtc.OBD2.Core.DTC;
		public PID		: _pid.OBD2.Core.PID;
		public OBD		: _obd.OBD2.Core.OBD;
		public Repeat	: _repeat.OBD2.Core.Repeater;
		public Device	: _device.OBD2.Device.Main;
		public Serial	: OBD2_SerialInterface;

		_options : any;

		public constructor( options : any )
		{
			super();

			debug("Initializing");

			this._options = options;

			this.DTC	= new DTC();
			this.PID	= new PID();
			this.OBD	= new OBD( this.PID.getList() );
			this.Repeat	= new Repeat( this._options.delay );
			this.Device = new Device( this._options.device );
			this.Serial = new Serial( this._options.serial );

			debug("Ready");
		}

		public start = ( cb : any ) =>
		{
			this.Serial.connect( this._options.port,
			{
				baudrate: this._options.baud
			});

			this.Serial.on("open", ( port ) =>
			{
				this.Device.connect( this.Serial, () =>
				{
					this._initListPID( cb );
				});
			});

			this.Serial.on("close", ( port ) =>
			{
				this.Device.disconnect( this.Serial );
			});

			this.Serial.on("data", ( data, port ) =>
			{
				this.OBD.parseDataStream( data, ( type, mess ) =>
				{
					this.emit( "data", mess, data );
					this.emit(  type , mess, data );
				});
			});
		};

		public listPID()
		{
			return this.PID.getListECU();
		}

		public  _initListPID_Timer;
		public  _initListPID = ( cb ) =>
		{
			var syncOnDataFunc, syncOnData;

			var pidSupportList = ["00","20","40","60","80","A0","C0"];
			var counter = 0;

			this.Repeat.pause();

			this.sendPID( pidSupportList[ counter ], "01" );

			var cleanUp = () =>
			{
				this.Serial.removeListener('data', syncOnDataFunc);

				delete syncOnData;
				delete syncOnDataFunc;

				this.Repeat.start();

				if ( this._initListPID_Timer !== null )
				{
					clearTimeout(this._initListPID_Timer);
					this._initListPID_Timer = null;

					cb();
				}
				else
				{
					clearTimeout(this._initListPID_Timer);
					this._initListPID_Timer = null;
				}

			};

			syncOnDataFunc = ( data ) =>
			{
				this.OBD.parseDataStream(data, ( type, mess ) =>
				{
					if ( type == "pid" && typeof mess.name !== "undefined" && typeof mess.value !== "undefined" )
					{
						this.PID._loadPidEcuList( mess.name, mess.value );
					}

					this._initListPID_Timer = setTimeout(cleanUp, 10000);
				});

				counter++;

				if ( counter  >= pidSupportList.length )
				{
					cleanUp();
				}
				else
				{
					this.sendPID( pidSupportList[ counter ], "01" );
				}
			};

			syncOnData = this.Serial.on("data", syncOnDataFunc);

		};

		public readPID( pidNumber : string, pidMode? : string )
		{
			pidMode = !pidMode ? "01" : pidMode;

			let pidData : any = this.PID.getByPid( pidNumber, pidMode );
			if ( pidData )
			{
				if ( pidData.pid !== "undefined" )
				{
					this.Serial.write( pidData.mode + pidData.pid + "1" + '\r' );
				}
				//There are modes which don't require a extra parameter ID.
				else
				{
					this.Serial.write( pidData.mode + "1" + '\r' );
				}

			}
			else
			{
				this.Serial.write( pidMode + pidNumber + "1" + '\r' );
			}

		}

		public sendPID( pidNumber : string, pidMode? : string )
		{
			pidMode = !pidMode ? "01" : pidMode;

			let pidData : any = this.PID.getByPid( pidNumber, pidMode );
			if ( pidData )
			{
				if ( pidData.pid !== "undefined" )
				{
					this.Serial.write( pidData.mode + pidData.pid + '\r' );
				}
				//There are modes which don't require a extra parameter ID.
				else
				{
					this.Serial.write( pidData.mode + '\r' );
				}

			}
			else
			{
				this.Serial.write( pidMode + pidNumber + '\r' );
			}

		}

		/*public writePid( data : any, pidNumber : string, pidMode? : string )
		{
			pidMode = !pidMode ? "01" : pidMode;
		}*/

		public write( data : any )
		{

		}

	}
}
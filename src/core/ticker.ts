/// <reference path="../typings/index.d.ts"/>

let debug  = require( "debug" )( "OBD2.Core.Ticker" );
let crypto = require( "crypto" );

export namespace OBD2
{
	export namespace Core
	{
		export class Ticker
		{
			private Ticker : any;

			private commands : any;
			private timeout : number;
			private counter : number;
			private waiting : boolean;
			private stopped : boolean;

			constructor( timeout : number )
			{
				this.timeout = timeout;

				this.commands = [];
				this.counter  = 0;
				this.stopped  = true;
				this.waiting  = false;

				debug( "Ready" );
			}

			/**
			 * Hashing data item
			 *
			 * @param type
			 * @param data
			 * @returns {Buffer|*}
			 */
			private hashItem( type, data )
			{
				let text = type;

				if ( Object.prototype.toString.call(data) == '[object Array]' )
				{
					text+= Object.keys(data);
					text+= data.toString();
					text+= Object.keys(data);
				}
				else if ( typeof data == "object")
				{
					text+= Object.keys(data);
					text+= Object.keys(data).map(function (key) {return data[key]}).toString();
					text+= Object.keys(data);
				}
				else
				{
					text+= data;
				}

				return crypto.createHash('md5').update(text).digest('hex');
			}

			/**
			 * Get next tick
			 */
			public writeNext() : void
			{
				setTimeout(() => {
					if ( this.commands.length > 0 )
					{
						this.waiting = true;

						let cmd = this.commands.shift();

						debug( "Tick " + String( cmd.type ) + " : " + String( cmd.data ) );

						if ( typeof cmd.call == "function" )
						{
							cmd.call(
								() => {
									this.waiting = false;
								},
								cmd
							);
						}

						if ( cmd.loop )
						{
							this.commands.push( cmd );
						}

						this.counter++;
						if ( !this.waiting )
						{
							this.writeNext();
						}
					}
				}, this.timeout);
			}

			/**
			 * Adding item for ticker
			 *
			 * @param type - Name of data type
			 * @param data - Value of data type
			 * @param loop - Automatic loop, or manual
			 * @param callBack - Item ticking callback
			 *
			 * @test Obd2CoreTickerTest
			 */
			public addItem( type : string, data : any, loop? : boolean, callBack? : any )
			{
				loop = loop ? loop : false;

				this.commands.push( {
					hash : this.hashItem( type, data ),
					type : type,
					data : data,
					loop : loop,
					call : callBack,
					fail : 0,
				} );

				this._autoTimer();
			}

			/**
			 * Remove ticker item
			 *
			 * @param type
			 * @param data
			 *
			 * @test Obd2CoreTickerTest
			 */
			public delItem( type : string, data : any )
			{
				let hash = this.hashItem( type, data );

				for ( let index in this.commands )
				{
					if ( this.commands.hasOwnProperty( index ) )
					{
						let cmd = this.commands[ index ];
						if ( cmd.hash === hash )
						{
							if ( this.commands.length > 1 )
							{
								this.commands.splice( index, 1 );
							}
							else
							{
								this.commands = [];
							}

							break;	// Loop break
						}
					}
				}

				this._autoTimer();
			}

			/**
			 * List ticker items
			 *
			 * @returns {any}
			 *
			 * @test Obd2CoreTickerTest
			 */
			public getList()
			{
				return this.commands;
			}

			/**
			 * Starting ticker loop
			 */
			public start()
			{
				debug( "Start" );

				if ( !this.stopped )
				{
					this.stopped = false;

					this.writeNext();
				}

				this.counter = 0;

//				this.Ticker  = setInterval(
//					() =>
//					{
//						this.counter++;
//						if ( !this.waiting /*|| this.counter >= parseInt(10000 / this.timeout)*/ )
//						{
//							this.writeNext();
//						}
//
//					},
//					this.timeout
//				);
			}

			/**
			 *
			 * Stopping ticker loop
			 */
			public stop()
			{
				debug( "Stop" );

				clearInterval( this.Ticker );

				this.commands = [];
				this.counter  = 0;
				this.stopped  = true;
				this.waiting  = false;
			}

			/**
			 * Pausing ticker loop
			 */
			public pause()
			{
				debug( "Pause" );

				clearInterval( this.Ticker );
			}

			private _autoTimer()
			{
				if ( this.commands.length > 0 )
				{
					if ( this.stopped )
					{
						//this.start();
						this.writeNext();
					}
				}
				else
				{
					this.stop();
				}

			}

		}

	}

}

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

			/**
			 * List of items
			 */
			private commands : any = [];

			/**
			 * Number of items
			 */
			private itemNums : any;

			/**
			 * Ticker time
			 */
			private timeout : number;

			/**
			 * Ticking count
			 */
			private counter : number;

			/**
			 * Tick in progress
			 */
			private waiting : boolean;

			/**
			 * Ticking is stopped
			 */
			private stopped : boolean;

			/**
			 * Loop out time
			 */
			private loopout : number;

			private waitNum : number;

			/**
			 * Constructor
			 *
			 * @param timeout
			 * @param loopout
			 */
			constructor( timeout : number, loopout? : number )
			{
				this.timeout = timeout;
				this.loopout  = (typeof loopout == "number" ? loopout : 1);
				this.waiting  = false;
				this.reset();

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
					sync : true
				} );

				this.itemNums = this.commands.length;

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

				this.itemNums = this.commands.length;

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

			private setWaiting( waiting ) {
				this.waiting = waiting;
			}

			private getWaiting() {
				return this.waiting;
			}

			/**
			 * Ticker loop
			 */
			public loopTick = () =>
			{
				let cmd;

				if ( this.commands.length > 0 )
				{

					cmd = this.commands[0];

					if ( cmd )
					{
						// Sync item
						if ( cmd.sync )
						{
							// Blocking?
							if ( this.waiting )
							{
								this.waitNum++;

								if ( this.waitNum >= this.loopout )
								{
									this.waiting = false;
									this.waitNum = 0;

									this.commands.shift();

									if ( cmd.loop )
									{
										this.commands.push(cmd);
									}
								}
								else
								{
									cmd.fail++;
								}
							}
							// No blocking
							else
							{
								if ( typeof cmd.call == "function" )
								{
									this.waiting = true;

									cmd.call(() =>
									{
										if ( cmd.sync )
										{
											this.waiting = false;
											this.waitNum = 0;
										}

										this.commands.shift();

										if ( cmd.loop )
										{
											this.commands.push(cmd);
										}
									}, cmd );
								}
							}
						}
						// Async item
						else
						{
							cmd.call(() =>
							{
								if ( cmd.loop )
								{
									this.commands.push(cmd);
								}
							}, cmd );

							this.commands.shift();
						}


					}
				}

				setTimeout(this.loopTick, this.timeout);
			};

			/**
			 * Starting ticker loop
			 */
			public start()
			{
				debug( "Start" );

				this.counter  = 0;
				this.stopped  = false;
				this.waiting  = false;
				this.waitNum  = 0;

				if ( !this.Ticker )
				{
					this.Ticker = setTimeout(this.loopTick, this.timeout);
				}
			}

			/**
			 * Stopping ticker loop
			 */
			public stop()
			{
				debug( "Stop" );

				clearTimeout(this.Ticker);
				this.reset();
			}

			/**
			 * Reset values
			 */
			public reset()
			{
				this.commands = [];
				this.counter  = 0;
				this.stopped  = true;
				this.waitNum  = 0;

				clearTimeout(this.Ticker);
			}

			/**
			 * Automatic timer start or stop
			 * Used in addItem and delItem
			 * 
			 * @private
			 */
			private _autoTimer()
			{
				if ( this.commands.length > 0 )
				{
					this.start();
				}
				else
				{
					this.stop();
				}

			}

		}

	}

}

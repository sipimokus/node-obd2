/// <reference path="../typings/index.d.ts"/>

let debug = require( "debug" )( "OBD2.Core.Ticker" );

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
			 * Get next tick
			 */
			public writeNext() : void
			{
				if ( this.commands.length > 0 )
				{
					this.waiting = true;

					let cmd = this.commands.shift();

					debug( "Tick " + String( cmd.type ) + " : " + String( cmd.data ) );

					cmd.call(
						() => {
							this.waiting = false;
						},
						cmd
					);

					if ( cmd.loop )
					{
						this.commands.push( cmd );
					}
				}

			}

			/**
			 * Adding item for ticker
			 *
			 * @param type - Name of data type
			 * @param data - Value of data type
			 * @param loop - Automatic loop, or manual
			 * @param callBack - Item ticking callback
			 */
			public addItem( type : string, data : any, loop? : boolean, callBack? : any )
			{
				loop = loop ? loop : false;

				this.commands.push( {
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
			 */
			public delItem( type : string, data : any )
			{
				for ( let index in this.commands )
				{
					if ( this.commands.hasOwnProperty( index ) )
					{
						let cmd = this.commands[ index ];
						if ( cmd.type === type && cmd.data === data )
						{
							if ( this.commands.length > 0 )
							{
								this.commands.splice( index, 1 );
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

				this.counter = 0;
				this.stopped = false;
				this.Ticker  = setInterval(
					() =>
					{
						this.counter++;
						if ( !this.waiting /*|| this.counter >= parseInt(10000 / this.timeout)*/ )
						{
							this.writeNext();
						}

					},
					this.timeout
				);
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
						this.start();
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

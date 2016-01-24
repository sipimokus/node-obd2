/// <reference path="../typings/tsd.d.ts"/>

let debug = require("debug")("OBD2.Core.Repeater");

interface PollerSettings
{
	interval : number;
	autoloop : boolean;
}

let _interval;

export namespace OBD2
{
	export module Core
	{
		export class Repeater
		{
			delay 	: number  = 250;
			loop	: boolean = false;

			_list	: any     = [];
			_index	: number  = -1;
			_count	: number  = 0;


			_interval : any	  = null;
			_runCall  : any	  = null;

			constructor( delay? : number )
			{
				this.setDelay( delay );

				debug("Ready");
			}

			runItem = ( callback : any ) : void =>
			{
				if ( typeof  callback === "function")
					this._runCall = callback;
			};

			addItem = ( repeatItem : any ) : void =>
			{
				if ( this.loop  )
				{
					this.pause();
					if ( !this._list.indexOf( repeatItem ) > -1 )
					{
						this._list.push( repeatItem );
					}
					this.start();
				}
				else
				{
					if ( !this._list.indexOf( repeatItem ) > -1 )
					{
						this._list.push( repeatItem );
					}
				}
			};

			addItemList = ( repeatItemList : any ) : void =>
			{
				if ( this.loop )
				{
					this.pause();
					for ( let repeatItem in repeatItemList )
					{
						this._list.push( repeatItemList[ repeatItem ] );
					}
					this.start();
				}
				else
				{
					for ( let repeatItem in repeatItemList )
					{
						this._list.push( repeatItemList[ repeatItem ] );
					}
				}
			};

			delItem = ( repeatItem : any ) : void =>
			{
				// Searching poller
				let index = this._list.indexOf( repeatItem );

				if ( index >= 0 )
				{
					this.pause();

					// Clear list if we have 1 item
					if ( this._list.length <= 1 )
					{
						this.reset( true );

					} // Remove elem from array, and shifting
					else
					{
						this._list.splice(index, 1);
					}

					this.start();
				}
			};

			getList = () : any =>
			{
				return this._list;
			};

			pause = () : void =>
			{
				clearTimeout( _interval );
				this.loop = false;
			};

			start = () : void =>
			{
				this.pause();
				this.reset();

				this._setInterval();

				this.loop = true;

				/*if ( this.delay > 0 )
				{
					_interval = setInterval( () =>
					{
						this.nextItem();

					}, this.delay);

					this.loop = true;
				}
				else
				{

				}*/

			};

			_setInterval = () =>
			{
				_interval = setTimeout( () =>
				{
					this.nextItem();
					this._setInterval();

				}, this.delay );


			};

			stop = () : void =>
			{
				clearTimeout( _interval );
				this.reset();
				this.loop = false;
			};

			reset = ( resetList? : boolean ) : void =>
			{
				if ( resetList )
				{
					this._list  = [];
				}
				this._index = -1;
				this._count = this._list.length
			};

			setDelay = ( time? : number ) : void =>
			{
				if ( typeof time === "number" )
				{
					this.delay = time;
				}

				debug("Delay time set: " + this.delay + "ms");
			};

			public nextItem = () =>
			{

				if ( this._count <= 0 )
				{
					return;
				}

				this._index++;

				if ( this._list[ this._index ] )
				{
					if ( this._runCall )
					{
						this._runCall( this._list[ this._index ] );
					}
					else
					{
						this._list[ this._index ]();
					}
				}

				if ( this._index >= this._count - 1 )
				{
					this._index = -1;
				}

			};
		}

	}

}

process.env.NODE_ENV = 'test';

var asserts = require( 'assert' );
var fs      = require( "fs" );
var path    = require( "path" );

describe( 'OBD2.Core.Ticker', function()
{
	var OBD2 = require( "../lib/core/ticker" ).OBD2;
	var subject;
	var testFilesPath;
	var timerDelay = 50;
	var timerOutLoop = 5;


	/**
	 * Constructor
	 */
	beforeEach( function ()
	{
		subject			= new OBD2.Core.Ticker( timerDelay, 5 );
		testFilesPath	= path.join( __dirname, "..", "src", "data", "pid" );
	});

	describe('#hashItem()', function ()
	{
		var testDataArray  = {"foo" : "bar"};
		var testDataBool   = true;
		var testDataObject = ["foo", "bar"];
		var testDataString = "foo-bar";

		it( 'Testing hashing Array', function()
		{
			asserts.equal("6add7240a420ac58d6c6175acb0b4ebd", subject.hashItem("PID", testDataArray, false));
		});

		it( 'Testing hashing Bool', function()
		{
			asserts.equal("1ca3d99e72a7ec32f5dd4b711eb70469", subject.hashItem("PID", testDataBool, false));
		});

		it( 'Testing hashing Object', function()
		{
			asserts.equal("dd5cd4ef41ecbcad84e8b6c5ed2bf843", subject.hashItem("PID", testDataObject, false));
		});

		it( 'Testing hashing String', function()
		{
			asserts.equal("e9f56c14262988a096da5f21d4fff93f", subject.hashItem("PID", testDataString, false));
		});
	});

	describe('#addItem()', function ()
	{
		var sendData = ["foo", "bar"];

		it( 'Testing adding item', function()
		{
			subject.addItem("PID", sendData, false);

			asserts.deepEqual( subject.getList(), [
				{
					hash : subject.hashItem("PID", sendData),
					type : "PID",
					data : sendData,
					loop : false,
					call : undefined,
					fail : 0,
					sync : true
				}
			], "Ticker list error" );
		});
	});

	describe('#delItem()', function ()
	{
		var sendData = ["foo", "bar"];

		it( 'Testing remove', function()
		{
			subject.addItem("PID", sendData, false);
			subject.delItem("PID", sendData);

			asserts.deepEqual( subject.getList(), [], "Ticker list error" );
		});

		it( 'Testing multiple remove', function()
		{
			subject.addItem("PID", sendData, false);
			subject.addItem("PID_FOO", sendData, false);
			subject.addItem("PID_BAR", sendData, false);

			subject.delItem("PID", sendData);
			subject.delItem("PID_FOO", sendData);
			subject.delItem("PID_BAR", sendData);

			asserts.deepEqual( subject.getList(), [], "Ticker list error" );
		});

		it( 'Testing remove item no exist', function()
		{
			subject.addItem("PID", sendData, false);
			subject.delItem("PID_FOO", sendData);

			asserts.deepEqual( subject.getList(), [
				{
					hash : subject.hashItem("PID", sendData),
					type : "PID",
					data : sendData,
					loop : false,
					call : undefined,
					fail : 0,
					sync : true
				}
			], "Ticker list error" );
		});
	});

	describe('#start()', function ()
	{
		var sendData = ["foo", "bar"];
		subject	     = new OBD2.Core.Ticker( timerDelay );

		it( 'Testing ticker precision', function(done)
		{
			var loop = 0;
			var time = Date.now();

			subject.addItem("PID", sendData, false, function()
			{
				loop++;
				time = Date.now() - time;

				subject.stop();

				// 10% tolerance
				if ( time >= timerDelay * 1.1 )
				{
					done("Ticker delay problem, too slow, time: " + time + ", loop: " + loop);
				}
				// 10% tolerance
				else if ( time <= timerDelay * 0.9 )
				{
					done("Ticker delay problem, too fast, time: " + time + ", loop: " + loop);
				}
				else
				{
					done();
				}
			});

			subject.start();
		});

		it( 'Testing ticker loop', function(done)
		{
			var loop = 0;
			var need = 10;
			var time = Date.now();

			subject.addItem("PID", sendData, true, function( next )
			{
				loop++;

				if ( loop == need )
				{
					time = Date.now() - time;

					subject.stop();

					// 10% tolerance
					if ( time >= timerDelay * need * 1.1 )
					{
						done("Ticker delay problem, too slow, time: " + time + ", loop: " + loop);
					}
					// 10% tolerance
					else if ( time <= timerDelay * need * 0.9 )
					{
						done("Ticker delay problem, too fast, time: " + time + ", loop: " + loop);
					}
					else
					{
						done();
					}
				}
				else
				{
					next();
				}
			});

			subject.start();
		});

		it( 'Testing ticker loop with one item 5 loop time out', function(done)
		{
			var loop = 0;
			var need = 10;
			var maxTime = parseInt((timerDelay * need + 1 * timerDelay * timerOutLoop) * 1.1);
			var minTime = parseInt((timerDelay * need + 1 * timerDelay * timerOutLoop) * 0.9);
			var time = Date.now();

			subject.addItem("PID", sendData, true, function( next )
			{
				loop++;

				if ( loop == need )
				{
					time = Date.now() - time;

					subject.stop();

					// 10% tolerance
					if ( time >= maxTime )
					{
						done("Ticker delay problem, too slow, time: " + time + ", max: " + maxTime +", loop: " + loop);
					}
					// 10% tolerance
					else if ( time <= minTime )
					{
						done("Ticker delay problem, too fast, time: " + time + ", min: " + minTime +", loop: " + loop);
					}
					else
					{
						done();
					}
				}
				else
				{
					// Skip one loop
					if ( loop != 5 )
						next();
				}
			});

			subject.start();
		});

		it( 'Testing ticker loop with three item 5 loop time out', function(done)
		{
			var loop = 0;
			var need = 10;
			var maxTime = parseInt((timerDelay * need + 3 * timerDelay * timerOutLoop) * 1.1);
			var minTime = parseInt((timerDelay * need + 3 * timerDelay * timerOutLoop) * 0.9);
			var time = Date.now();

			subject.addItem("PID", sendData, true, function( next )
			{
				loop++;

				if ( loop == need )
				{
					time = Date.now() - time;

					subject.stop();

					// 10% tolerance
					if ( time >= maxTime )
					{
						done("Ticker delay problem, too slow, time: " + time + ", max: " + maxTime +", loop: " + loop);
					}
					// 10% tolerance
					else if ( time <= minTime )
					{
						done("Ticker delay problem, too fast, time: " + time + ", min: " + minTime +", loop: " + loop);
					}
					else
					{
						done();
					}
				}
				else
				{
					// Skip one loop
					if ( loop != 3 && loop != 5 && loop != 7 )
						next();
				}
			});

			subject.start();
		});

	});

} );
process.env.NODE_ENV = 'test';

var asserts = require( 'assert' );
var fs      = require( "fs" );
var path    = require( "path" );

describe( 'OBD2.Core.Ticker', function()
{
	var OBD2 = require( "../lib/core/ticker" ).OBD2;
	var subject;
	var testFilesPath;


	/**
	 * Constructor
	 */
	beforeEach( function ()
	{
		subject			= new OBD2.Core.Ticker( 50 );
		testFilesPath	= path.join( __dirname, "..", "src", "data", "pid" );
	});

	describe('#addItem()', function ()
	{
		var sendData = ["foo", "bar"];

		it( 'Testing finding Loaders files', function()
		{
			subject.addItem("PID", sendData, false);
			asserts.deepEqual( subject.getList(), [
				{
					type : "PID",
					data : sendData,
					loop : false,
					call : undefined,
					fail : 0
				}
			], "Ticker list error" );
		});
	});

	describe('#delItem()', function ()
	{
		var sendData = ["foo", "bar"];

		it( 'Testing item remove', function()
		{
			subject.addItem("PID", sendData, false);

			subject.delItem("PID", sendData);
			asserts.deepEqual( subject.getList(), [], "Ticker list error" );
		});

		it( 'Testing item no exist', function()
		{
			subject.addItem("PID", sendData, false);

			subject.delItem("PID_FOO", sendData);
			asserts.deepEqual( subject.getList(), [
				{
					type : "PID",
					data : sendData,
					loop : false,
					call : undefined,
					fail : 0
				}
			], "Ticker list error" );
		});
	});

} );
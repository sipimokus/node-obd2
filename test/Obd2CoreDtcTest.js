process.env.NODE_ENV = 'test';

var asserts = require( 'assert' );
var fs      = require( "fs" );
var path    = require( "path" );

describe( 'OBD2.Core.DTC', function()
{
	var OBD2 = require( "../lib/core/dtc" ).OBD2;
	var subject;
	var testFilesPath;


	/**
	 * Constructor
	 */
	beforeEach( function ()
	{
		subject			= new OBD2.Core.DTC();
		testFilesPath	= path.join( __dirname, "..", "src", "data", "pid" );
	});

	describe('#_loadDtcList()', function ()
	{
		it( 'Testing finding Loaders files', function()
		{
			subject._loadDtcList( testFilesPath );
		});

	});

} );
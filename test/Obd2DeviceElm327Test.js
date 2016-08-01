process.env.NODE_ENV = 'test';

var asserts = require( 'assert' );
var fs      = require( "fs" );
var path    = require( "path" );

describe( 'OBD2.Device.ELM327', function()
{
	var OBD2 = require( "../lib/device/elm327" ).OBD2;
	var subject;
	var testFilesPath;


	/**
	 * Constructor
	 */
	beforeEach( function ()
	{
		subject			= new OBD2.Device.ELM327();
	});

	describe('#_loadDtcList()', function ()
	{

	});

} );
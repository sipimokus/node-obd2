process.env.NODE_ENV = 'test';

var asserts = require( 'assert' );
var fs      = require( "fs" );
var path    = require( "path" );

describe( 'OBD2.Device.Main', function()
{
	var OBD2 = require( "../lib/device" ).OBD2;
	var subject;
	var testFilesPath;


	/**
	 * Constructor
	 */
	beforeEach( function ()
	{
		subject			= new OBD2.Device.Main();
	});
/*
	describe('#connect()', function ()
	{
		it( 'Testing finding Loaders files', function()
		{

		});

	});

	describe('#disconnect()', function ()
	{
		it( 'Testing finding Loaders files', function()
		{

		});

	});

	describe('#loadDevice()', function ()
	{
		it( 'Testing finding Loaders files', function()
		{

		});

	});

	describe('#getDevice()', function ()
	{
		it( 'Testing finding Loaders files', function()
		{

		});

	});

	describe('#getDeviceName()', function ()
	{
		it( 'Testing finding Loaders files', function()
		{

		});

	});

	describe('#setDevice()', function ()
	{
		it( 'Testing finding Loaders files', function()
		{

		});

	});
*/
} );
process.env.NODE_ENV = "test";

var asserts = require( "assert" );
var fs      = require( "fs" );
var path    = require( "path" );

describe( "OBD2.Core.PID", function()
{
	var OBD2 = require( "../lib/core/pid" ).OBD2;
	var subject;
	var testFilesPath;
	var pidList;
	var ecuList;


	/**
	 * Constructor
	 */
	beforeEach( function ()
	{
		subject			= new OBD2.Core.PID();
		testFilesPath	= path.join( __dirname, "..", "src", "data", "pid" )
	});

	describe("#_loadPidList()", function ()
	{
		it( "Testing loading PID files", function()
		{
			subject._loadPidList( testFilesPath );

			pidList = subject.getListPID();
		});
	});

	describe("#_loadPidEcuList()", function ()
	{
		it( "Testing loading PID support", function()
		{
			asserts.equal( subject._loadPidEcuList( "pidsupp0", "BE1FA813" ), true, "Not found PID" );

			ecuList = subject.getListECU();
		});
	});

	describe("#_dec2hex()", function ()
	{
		it( "Testing convert DEC to HEX number", function()
		{
			asserts.equal( subject._dec2hex( 0 ),  "00" );
			asserts.equal( subject._dec2hex( 1 ),  "01" );
			asserts.equal( subject._dec2hex( 10 ), "0A" );
			asserts.equal( subject._dec2hex( 32 ), "20" );
			asserts.equal( subject._dec2hex( 255 ), "FF" );
		});
	});

	describe("#_hex2dec()", function ()
	{
		it( "Testing convert HEX to DEC number", function()
		{
			asserts.equal( subject._hex2dec( "0" ), 0  );
			asserts.equal( subject._hex2dec( "1" ), 1  );
			asserts.equal( subject._hex2dec( "F" ), 15 );

			asserts.equal( subject._hex2dec( "00" ), 0  );
			asserts.equal( subject._hex2dec( "01" ), 1  );
			asserts.equal( subject._hex2dec( "0A" ), 10 );
			asserts.equal( subject._hex2dec( "20" ), 32 );
			asserts.equal( subject._hex2dec( "FF" ), 255 );
		});
	});

	describe("#getListPID()", function ()
	{
		it( "Testing loaded PID list", function ()
		{
			asserts.notEqual( pidList.length, 0, "PID list is empty" );
		});

	});

	describe("#getListECU()", function ()
	{
		it( "Testing loaded PID ECU list", function ()
		{
			asserts.notEqual(  ecuList.length, 0, "ECU PID list empty" );
			asserts.deepEqual( ecuList, [ '01', '03', '04', '05', '06', '07', '0C', '0D', '0E', '0F', '10', '11', '13', '15', '1C', '1F', '20' ], "ECU PID list error" );
		});
	});

	describe("#getList()", function ()
	{
		it( "Testing loaded PID ECU supported list", function ()
		{
			subject._loadPidList( testFilesPath );
			subject._loadPidEcuList( "pidsupp0", "BE1FA813" );

			asserts.notEqual(  subject.getList().length, 0, "PID ECU list is empty" );
			asserts.deepEqual( subject.getList(), [ '10', '11', '20' ], "ECU PID list error" );
		});

	});

	describe("#getByName()", function ()
	{
		it( "Testing get PID details by pid name", function()
		{
			var detailsRPM = subject.getByName( "rpm" );
			var detailsVSS = subject.getByName( "vss" );


			asserts.equal( detailsRPM.pid, "0C", "PID rpm not found" );
			asserts.equal( detailsVSS.pid, "0D", "PID vss not found" );
		});
	});

	describe("#getByPid()", function ()
	{
		it( "Testing get PID details by pid number", function()
		{
			var detailsRPM = subject.getByPid( "0C" );
			var detailsVSS = subject.getByPid( "0D", "01" );


			asserts.equal( detailsRPM.name, "rpm", "PID rpm not found" );
			asserts.equal( detailsVSS.name, "vss", "PID vss not found" );
		});
	});


} );
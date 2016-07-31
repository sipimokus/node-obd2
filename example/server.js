process.env.NODE_ENV   = "debug";
process.env.DEBUG      = "Example,OBD2.*";

//process.env.NODE_ENV   = "production";
//process.env.DEBUG      = false;

var obd2 = require("../index");
var OBD = new obd2({
    device  : "ELM327", // Device type
    serial  : "fake",   // usb, bluetooth
    port    : "COM6",   // Device COM port / path
    baud    : 38400,    // Device baud rate
    delay   : 50,       // Ticker delay time (ms)
    cleaner : true      // Automatic ticker list cleaner ( ex. PID not supported, no response )
});

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var debug = require("debug")("Example");

app.use('/assets', express.static( __dirname + '/assets') );

// Server
http.listen(3000, function()
{
    debug('Listening on *:3000');

    // OBD Initializing
    OBD.start( function()
    {
        debug("OBD2 example start");

        OBD.listDTC();

        OBD.on("dataParsed", function( type, elem, data )
        {
            io.emit('obd2', type, elem, data );
        });

        OBD.on("pid", function( data )
        {
            io.emit('pid', data );
        });

        OBD.on("dtc", function( data )
        {
            io.emit('dtcList', data );
        });

/* Extra usage code
        OBD.listPID(function( pidList )
        {
            // io.emit list
            io.emit('pidList', pidList );

            // io.emit pid
            OBD.readPID( "0C" );

            // io.emit pid & vss
            OBD.readPID( "0D", function( data )
            {
                io.emit('vss', data );
            });

            // Unavailable, auto clean
            OBD.readPID( "99" );

        });
*/

    });

});

app.get('/', function(req, res)
{
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket)
{
    debug('User connected');

    socket.on('disconnect', function()
    {
        debug('User disconnected');
    });

    socket.on('pidTickerList', function( addList )
    {
        OBD.Ticker.stop();
        for ( var index in addList )
        {
            OBD.readPID( addList[ index ] );
        }
    });

    socket.on('pidList', function()
    {
        OBD.listPID( function( pidList )
        {
            io.emit('pidList', pidList );
            OBD.listDTC();
        });
    });

    OBD.listPID( function( pidList )
    {
        io.emit('pidList', pidList );
        OBD.listDTC();
    });



});
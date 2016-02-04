process.env.NODE_ENV   = "debug";
process.env.DEBUG      = "Test";

var debug = require("debug")("Test");
var obd2 = require("./index");
var OBD = new obd2({
    device  : "ELM327", // Device type
    serial  : "fake",   // usb, bluetooth
    port    : "COM6",   // Device COM port / path
    baud    : 38400,    // Device baud rate
    delay   : 50        // Repeat delay time (ms)
});

OBD.start(function( car )
{
    console.log("TEST START, OBD READY");
    OBD.sendPID("00", "00");

    /*OBD._initListPID(function(){
     console.log("PIDSUPP");
     console.log(OBD.listPID());
     });*/
    //console.log( OBD.PID.getList() );




    //debug(OBD.listPID());

    /*setInterval(()=>{
        OBD.readPID("0c");
    }, 1000);
*/

    //OBD.sendPID("00", "01");



    //OBD.Repeat.stop();
    //OBD.Repeat.start();
    //OBD.Repeat.addItem("0C");
    //OBD.Repeat.addItemList(["0A", "0B", "0D"]);

    // All data and response object
    OBD.on("data", function( value, data )
    {
        //OBD.Repeat.nextItem();
        console.log(value, data);
    });

    // ECU commands
    OBD.on("ecu", function( value, data )
    {
        //console.log(data);
    });

    // PID commands
    OBD.on("pid", function( value, data )
    {
        debug("PID: ", value);
    });

    // DCT commands
    OBD.on("dct", function( value, data )
    {
        //console.log(value);
    });

    // Bugged or unhandled response
    OBD.on("bug", function( value, data )
    {
        //console.log("BUG: " + data);
        //console.log(value);
    });


    //OBD.readSyncPID("0C");
    //OBD.readAsyncPID("0C", "01");

    //OBD.readPID(pid, mode?);
    //OBD.readDTC();

    //OBD.readLoopPID([], mode, cb);

    /*OBD.onDataPID(function( data )
    {

    });*/
});

OBD.Repeat.runItem(function( item )
{
    OBD.readPID( item );
});
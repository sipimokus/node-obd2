module.exports =
{
    mode:   "01",
    pid:    "1F",
    name:   "runtm",
    description: "Time Since Engine Start",

    min:    0,
    max:    65535,
    unit:   "seconds",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) );
    },
    testResponse: function( emulator )
    {
        return 40;
    }
};
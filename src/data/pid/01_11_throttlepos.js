module.exports =
{
    mode:   "01",
    pid:    "11",
    name:   "throttlepos",
    description: "Absolute Throttle Position",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return ( parseInt( byteA, 16 ) * 100 / 255 );
    },
    testResponse: function( emulator )
    {
        return 40;
    }
};
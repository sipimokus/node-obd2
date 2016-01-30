module.exports =
{
    mode:   "01",
    pid:    "09",
    name:   "longft24",
    description: "Long Term Fuel Trim - Bank 2,4",

    min:    -100,
    max:    99.22,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return ( parseInt( byteA, 16 ) - 128 ) * ( 100 / 128 );
    },
    testResponse: function( emulator )
    {
        return 1;
    }
};
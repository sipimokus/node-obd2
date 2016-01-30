module.exports =
{
    mode:   "01",
    pid:    "06",
    name:   "shrtft13",
    description: "Short Term Fuel Trim - Bank 1,3",

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
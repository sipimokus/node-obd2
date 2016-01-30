module.exports =
{
    mode:   "01",
    pid:    "5E",
    name:   "fuelrate",
    description: "Engine fuel rate",

    min:    0,
    max:    3212.75,
    unit:   "L/h",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) ) * 0.05;
    },
    testResponse: function( emulator )
    {
        return 40;
    }
};
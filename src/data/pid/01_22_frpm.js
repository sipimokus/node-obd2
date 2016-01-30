module.exports =
{
    mode:   "01",
    pid:    "22",
    name:   "frpm",
    description: "Fuel Rail Pressure relative to manifold vacuum",

    min:    0,
    max:    5177.265,
    unit:   "kPa",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) ) * 0.079;
    },
    testResponse: function( emulator )
    {
        return 40;
    }
};
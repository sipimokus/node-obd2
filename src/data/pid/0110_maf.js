module.exports =
{
    mode:   "01",
    pid:    "10",
    name:   "maf",
    description: "Air Flow Rate from Mass Air Flow Sensor",

    min:    0,
    max:    655.35,
    unit:   "g/s",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( parseInt( byteA, 16 ) * 256.0 ) + ( parseInt( byteB, 16 ) / 100 );
    }
};
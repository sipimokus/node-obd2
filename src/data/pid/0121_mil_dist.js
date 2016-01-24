module.exports =
{
    mode:   "01",
    pid:    "21",
    name:   "mil_dist",
    description: "Distance Travelled While MIL is Activated",

    min:    0,
    max:    65535,
    unit:   "km",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) );
    }
};
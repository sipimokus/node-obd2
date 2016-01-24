module.exports =
{
    mode:   "01",
    pid:    "31",
    name:   "clr_dist",
    description: "Distance since diagnostic trouble codes cleared",

    min:    0,
    max:    65535,
    unit:   "km",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) );
    }
};
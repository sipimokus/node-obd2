module.exports =
{
    mode:   "01",
    pid:    "4E",
    name:   "clr_time",
    description: "Time since diagnostic trouble codes cleared",

    min:    0,
    max:    65535,
    unit:   "minutes",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 );
    }
};
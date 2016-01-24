module.exports =
{
    mode:   "01",
    pid:    "54",
    name:   "evapsys_vappress",
    description: "Evap system vapor pressure",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) ) - 32767;
    }
};
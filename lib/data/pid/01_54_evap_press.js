module.exports =
{
    mode:   "01",
    pid:    "54",
    name:   "evap_press",
    description: "Evap system vapor pressure",

    min:    -32767,
    max:    32768,
    unit:   "Pa",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) ) - 32767;
    }
};
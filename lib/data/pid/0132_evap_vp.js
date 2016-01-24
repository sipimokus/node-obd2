module.exports =
{
    mode:   "01",
    pid:    "32",
    name:   "evap_vp",
    description: "Evap System Vapour Pressure",

    min:    -8192,
    max:    8192,
    unit:   "Pa",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) ) / 4;
    }
};
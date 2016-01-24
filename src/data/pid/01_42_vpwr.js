module.exports =
{
    mode:   "01",
    pid:    "42",
    name:   "vpwr",
    description: "Control module voltage",

    min:    0,
    max:    65535,
    unit:   "V",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) ) / 1000;
    }
};
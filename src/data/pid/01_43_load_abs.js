module.exports =
{
    mode:   "01",
    pid:    "43",
    name:   "load_abs",
    description: "Absolute Load Value",

    min:    0,
    max:    25700,
    unit:   "%",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) ) * 100 / 255;
    }
};
module.exports =
{
    mode:   "01",
    pid:    "2D",
    name:   "egr_err",
    description: "EGR Error",

    min:    -100,
    max:    99.22,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return ( ( parseInt( byteA, 16 ) - 128 ) * 100 / 128 );
    }
};
module.exports =
{
    mode:   "01",
    pid:    "2C",
    name:   "egr_pct",
    description: "Commanded EGR",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return ( ( parseInt( byteA, 16 ) * 100 ) / 255 );
    }
};
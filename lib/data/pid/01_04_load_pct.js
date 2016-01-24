module.exports =
{
    mode:   "01",
    pid:    "04",
    name:   "load_pct",
    description: "Calculated LOAD Value",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  2,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) * (100 / 256);
    }
};
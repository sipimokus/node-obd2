module.exports =
{
    mode:   "01",
    pid:    "52",
    name:   "alch_pct",
    description: "Ethanol fuel %",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) * 100 / 255;
    }
};
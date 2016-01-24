module.exports =
{
    mode:   "01",
    pid:    "46",
    name:   "ambient",
    description: "Ambient air temperature",

    min:    -40,
    max:    215,
    unit:   "Celsius",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) - 40
    }
};
module.exports =
{
    mode:   "01",
    pid:    "5C",
    name:   "oiltemp",
    description: "Engine oil temperature",

    min:    -40,
    max:    210,
    unit:   "°C",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) - 140;
    }
};
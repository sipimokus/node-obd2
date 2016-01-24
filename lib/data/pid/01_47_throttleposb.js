module.exports =
{
    mode:   "01",
    pid:    "47",
    name:   "throttleposb",
    description: "Absolute Throttle Position B",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) * 100 / 255;
    }
};
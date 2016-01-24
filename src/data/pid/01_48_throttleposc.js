module.exports =
{
    mode:   "01",
    pid:    "48",
    name:   "throttleposc",
    description: "Absolute Throttle Position C",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) * 100 / 255;
    }
};
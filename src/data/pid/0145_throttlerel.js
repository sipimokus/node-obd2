module.exports =
{
    mode:   "01",
    pid:    "45",
    name:   "throttlerel",
    description: "Relative Throttle Position",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) * 100 / 255;
    }
};
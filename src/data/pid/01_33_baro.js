module.exports =
{
    mode:   "01",
    pid:    "33",
    name:   "baro",
    description: "Barometric Pressure",

    min:    0,
    max:    255,
    unit:   "kPa",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 );
    }
};
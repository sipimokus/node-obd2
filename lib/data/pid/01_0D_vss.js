module.exports =
{
    mode:   "01",
    pid:    "0D",
    name:   "vss",
    description: "Vehicle Speed Sensor",

    min:    0,
    max:    255,
    unit:   "km/h",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 );
    }
};
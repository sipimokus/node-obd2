module.exports =
{
    mode:   "01",
    pid:    "05",
    name:   "temp",
    description: "Engine Coolant Temperature",

    min:    -40,
    max:    215,
    unit:   "Celsius",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) - 40;
    }
};
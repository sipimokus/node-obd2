module.exports =
{
    mode:   "01",
    pid:    "0F",
    name:   "iat",
    description: "Intake Air Temperature",

    min:    -40,
    max:    215,
    unit:   "Celsius",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) - 40;
    }
};
module.exports =
{
    mode:   "01",
    pid:    "0F",
    name:   "iat",
    description: "Intake Air Temperature",

    min:    -40,
    max:    215,
    unit:   "°C",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) - 40;
    },
    testResponse: function( emulator )
    {
        return 40;
    }
};
module.exports =
{
    mode:   "01",
    pid:    "0A",
    name:   "frp",
    description: "Fuel Rail Pressure (gauge)",

    min:    0,
    max:    765,
    unit:   "kPa",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) * 3;
    },
    testResponse: function( emulator )
    {
        return 40;
    }
};
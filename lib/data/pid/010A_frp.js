module.exports =
{
    mode:   "01",
    pid:    "0A",
    name:   "frp",
    description: "Fuel Rail Pressure (gauge)",

    min:    -100,
    max:    99.22,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) * 3;
    }
};
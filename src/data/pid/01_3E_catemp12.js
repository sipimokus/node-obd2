module.exports =
{
    mode:   "01",
    pid:    "3E",
    name:   "catemp12",
    description: "Catalyst Temperature Bank 1 / Sensor 2",

    min:    -40,
    max:    6513.5,
    unit:   "Celsius",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) ) / 10 - 40;
    }
};
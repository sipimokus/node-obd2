module.exports =
{
    mode:   "01",
    pid:    "3D",
    name:   "catemp21",
    description: "Catalyst Temperature Bank 2 /  Sensor 1",

    min:    -40,
    max:    6513.5,
    unit:   "Celsius",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) ) / 10 - 40;
    }
};
module.exports =
{
    mode:   "01",
    pid:    "23",
    name:   "frpd",
    description: "Fuel Rail Pressure (diesel)",

    min:    0,
    max:    655350,
    unit:   "kPa",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) ) * 10;
    }
};
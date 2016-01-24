module.exports =
{
    mode:   "01",
    pid:    "44",
    name:   "lambda",
    description: "Fuel/air Commanded Equivalence Ratio",

    min:    0,
    max:    2,
    unit:   "(ratio)",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) ) / 32768;
    }
};
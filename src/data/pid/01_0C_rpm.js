module.exports =
{
    mode:   "01",
    pid:    "0C",
    name:   "rpm",
    description: "Engine RPM",

    min:    0,
    max:    16383.75,
    unit:   "rev/min",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) ) / 4;
    },
    testResponse: function( emulator )
    {
        return Math.random() * 4000 + 1000;
    }
};
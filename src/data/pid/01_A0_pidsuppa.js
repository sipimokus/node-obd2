module.exports =
{
    mode:   "01",
    pid:    "A0",
    name:   "pidsuppa",
    description: "PIDs supported A1-C0",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    bytes:  4,
    convertToUseful: function( byteA, byteB, byteC, byteD )
    {
        return String( byteA ) + String( byteB ) + String( byteC ) + String( byteD );
    }
};
module.exports =
{
    mode:   "01",
    pid:    "C0",
    name:   "pidsuppc",
    description: "PIDs supported C1-E0",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    bytes:  4,
    convertToUseful: function( byteA, byteB, byteC, byteD )
    {
        return String( byteA ) + String( byteB ) + String( byteC ) + String( byteD );
    }
};
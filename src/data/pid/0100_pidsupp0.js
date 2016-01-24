module.exports =
{
    mode:   "01",
    pid:    "00",
    name:   "pidsupp0",
    description: "PIDs supported 00-20",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    bytes:  4,
    convertToUseful: function( byteA, byteB, byteC, byteD )
    {
        return String( byteA ) + String( byteB ) + String( byteC ) + String( byteD );
    }
};
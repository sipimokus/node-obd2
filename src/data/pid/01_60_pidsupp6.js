module.exports =
{
    mode:   "01",
    pid:    "60",
    name:   "pidsupp6",
    description: "PIDs supported 61-80",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    bytes:  4,
    convertToUseful: function( byteA, byteB, byteC, byteD )
    {
        return String( byteA ) + String( byteB ) + String( byteC ) + String( byteD );
    }
};
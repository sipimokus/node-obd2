module.exports =
{
    mode:   "01",
    pid:    "40",
    name:   "pidsupp4",
    description: "PIDs supported 41-60",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    bytes:  4,
    convertToUseful: function( byteA, byteB, byteC, byteD )
    {
        return String( byteA ) + String( byteB ) + String( byteC ) + String( byteD );
    }
};
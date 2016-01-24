module.exports =
{
    mode:   "01",
    pid:    "20",
    name:   "pidsupp2",
    description: "PIDs supported 21-40",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    bytes:  4,
    convertToUseful: function( byteA, byteB, byteC, byteD )
    {
        return String( byteA ) + String( byteB ) + String( byteC ) + String( byteD );
    }
};
module.exports =
{
    mode:   "01",
    pid:    "80",
    name:   "pidsupp8",
    description: "PIDs supported 81-A0",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    bytes:  4,
    convertToUseful: function( byteA, byteB, byteC, byteD )
    {
        return String( byteA ) + String( byteB ) + String( byteC ) + String( byteD );
    }
};
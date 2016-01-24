module.exports =
{
    mode:   "09",
    pid:    "00",
    name:   "vinsupp0",
    description: "Vehicle Identification Number",

    min:    undefined,
    max:    undefined,
    unit:   "undefined",

    bytes:  4,
    convertToUseful: function( byteA, byteB, byteC, byteD )
    {
        return String( byteA ) + String( byteB ) + String( byteC ) + String( byteD );
    }
};
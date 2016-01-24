module.exports =
{
    mode:   "09",
    pid:    "01",
    name:   "vin1",

    description: "Vehicle Identification Number",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return byteA;
    }
};
module.exports =
{
    mode:   "09",
    pid:    "0A",
    name:   "ecu_name",

    description: "ECU name",

    bytes:  20,
    convertToUseful: function( byteA )
    {
        return byteA;
    }
};
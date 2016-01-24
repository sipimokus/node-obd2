module.exports =
{
    mode:   "09",
    pid:    "09",
    name:   "ecu_name_count",

    description: "ECU name count for PID A0",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return byteA;
    }
};
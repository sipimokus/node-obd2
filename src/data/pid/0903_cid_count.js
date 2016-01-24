module.exports =
{
    mode:   "09",
    pid:    "03",
    name:   "cid_count",

    description: "Calibraton ID message count for PID 04",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return byteA;
    }
};
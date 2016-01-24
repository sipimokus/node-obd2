module.exports =
{
    mode:   "09",
    pid:    "05",
    name:   "cvn_count",

    description: "Calibration verification numbers message count for PID 06",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return byteA;
    }
};
module.exports =
{
    mode:   "09",
    pid:    "06",
    name:   "cvn_count",

    description: "Calibration verification numbers",

    bytes:  4,
    convertToUseful: function( byteA, byteB, byteC, byteD )
    {
        return byteA;
    }
};
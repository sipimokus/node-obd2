module.exports =
{
    mode:   "09",
    pid:    "04",
    name:   "cid",

    description: "Calibration ID",

    bytes:  16,
    convertToUseful: function( byteA )
    {
        return byteA;
    }
};
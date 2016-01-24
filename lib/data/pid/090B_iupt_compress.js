module.exports =
{
    mode:   "09",
    pid:    "0B",
    name:   "iupt_compress",

    description: "In-use performance tracking for compression ignition vehicles",

    bytes:  4,
    convertToUseful: function( byteA )
    {
        return byteA;
    }
};
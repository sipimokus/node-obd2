module.exports =
{
    mode:   "09",
    pid:    "07",
    name:   "iupt_spark_count",

    description: "In-use performance tracking message count PID 08",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return byteA;
    }
};
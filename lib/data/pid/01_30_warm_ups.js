module.exports =
{
    mode:   "01",
    pid:    "30",
    name:   "warm_ups",
    description: "Number of warm-ups since diagnostic trouble codes cleared",

    min:    0,
    max:    255,
    unit:   "",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 );
    }
};
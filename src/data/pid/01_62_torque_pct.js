module.exports =
{
    mode:   "01",
    pid:    "62",
    name:   "torque_pct",
    description: "Actual engine percent torque",

    min:    -125,
    max:    125,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return ( parseInt( byteA, 16 ) - 125 );
    },
    testResponse: function( emulator )
    {
        return 40;
    }
};
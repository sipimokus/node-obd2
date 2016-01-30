module.exports =
{
    mode:   "01",
    pid:    "61",
    name:   "demand_pct",
    description: "Driver's demand engine percent torque",

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
module.exports =
{
    mode:   "01",
    pid:    "4D",
    name:   "mil_time",
    description: "Time run by the engine while MIL activated",

    min:    0,
    max:    65525,
    unit:   "minutes",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 );
    }
};
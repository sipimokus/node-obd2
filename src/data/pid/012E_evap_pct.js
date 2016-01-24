module.exports =
{
    mode:   "01",
    pid:    "2E",
    name:   "evap_pct",
    description: "Commanded Evaporative Purge",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return ( ( parseInt( byteA, 16 ) * 100 ) / 255 );
    }
};
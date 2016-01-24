module.exports =
{
    mode:   "01",
    pid:    "4C",
    name:   "tac_pct",
    description: "Commanded Throttle Actuator Control",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) * 100 / 255;
    }
};
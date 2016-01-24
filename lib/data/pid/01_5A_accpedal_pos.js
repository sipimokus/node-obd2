module.exports =
{
    mode:   "01",
    pid:    "5A",
    name:   "accpedal_pos",
    description: "Relative accelerator pedal position",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return ( parseInt( byteA, 16 ) * 100 ) / 255;
    }
};
module.exports =
{
    mode:   "01",
    pid:    "4B",
    name:   "accpedalf",
    description: "Accelerator Pedal Position F",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) * 100 / 255;
    }
};
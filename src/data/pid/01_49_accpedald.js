module.exports =
{
    mode:   "01",
    pid:    "49",
    name:   "accpedald",
    description: "Accelerator Pedal Position D",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) * 100 / 255;
    }
};
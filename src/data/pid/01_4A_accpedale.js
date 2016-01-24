module.exports =
{
    mode:   "01",
    pid:    "4A",
    name:   "accpedale",
    description: "Accelerator Pedal Position E",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 ) * 100 / 255;
    }
};
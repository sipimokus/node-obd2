module.exports =
{
    mode:   "01",
    pid:    "0E",
    name:   "sparkadv",
    description: "Ignition Timing Advance for #1 Cylinder",

    min:    -64,
    max:    63.5,
    unit:   "degrees relative to #1 cylinder",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return ( parseInt( byteA, 16 ) / 2 ) - 64;
    }
};
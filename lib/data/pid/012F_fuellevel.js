module.exports =
{
    mode:   "01",
    pid:    "2F",
    name:   "fuellevel",
    description: "Fuel Level Input",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return ( ( parseInt( byteA, 16 ) * 100 ) / 255 );
    }
};
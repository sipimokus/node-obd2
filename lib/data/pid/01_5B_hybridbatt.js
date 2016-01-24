module.exports =
{
    mode:   "01",
    pid:    "5A",
    name:   "hybridbatt",
    description: "Hybrid battery pack remaining life",

    min:    0,
    max:    100,
    unit:   "%",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return ( parseInt( byteA, 16 ) * 100 ) / 255;
    }
};
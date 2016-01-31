module.exports =
{
    mode:   "01",
    pid:    "02",
    name:   "dtcfrzf",
    description: "DTC that caused required freeze frame data storage",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    polling : false,

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return parseInt( byteA, 2);
    }
};
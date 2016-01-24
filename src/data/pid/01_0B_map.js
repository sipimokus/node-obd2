module.exports =
{
    mode:   "01",
    pid:    "0B",
    name:   "map",
    description: "Intake Manifold Absolute Pressure",

    min:    0,
    max:    255,
    unit:   "kPa",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 );
    }
};
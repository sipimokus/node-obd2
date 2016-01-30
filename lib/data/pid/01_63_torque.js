module.exports =
{
    mode:   "01",
    pid:    "63",
    name:   "torque",
    description: "Engine reference torque",

    min:    0,
    max:    65535,
    unit:   "Nm",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) );
    },
    testResponse: function( emulator )
    {
        return 40;
    }
};
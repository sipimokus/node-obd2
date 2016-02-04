var actTest = 1;
var incTest = true;

module.exports =
{
    mode:   "01",
    pid:    "0D",
    name:   "vss",
    description: "Vehicle Speed Sensor",

    min:    0,
    max:    255,
    unit:   "km/h",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        return parseInt( byteA, 16 );
    },
    testResponse: function( emulator )
    {
        if ( actTest*actTest >= 64000 || actTest <= 0 )
        {
            incTest = !incTest;
        }


        if ( incTest )
        {
            actTest++;
        }
        else
        {
            actTest--;
        }

        //actTest++;

        return parseInt( 1000 + actTest*actTest );
    }
};
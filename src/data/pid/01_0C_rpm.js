var actTest = 1;
var incTest = true;

module.exports =
{
    mode:   "01",
    pid:    "0C",
    name:   "rpm",
    description: "Engine RPM",

    min:    0,
    max:    16383.75,
    unit:   "rev/min",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        return ( ( parseInt( byteA, 16 ) * 256 ) + parseInt( byteB, 16 ) ) / 4;
    },
    testResponse: function( emulator )
    {
        if ( actTest*actTest >= 32000 || actTest <= 0 )
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
module.exports =
{
    mode:   "01",
    pid:    "12",
    name:   "air_stat",
    description: "Commanded Secondary Air Status",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        /*
         1	Upstream
         2	Downstream of catalytic converter
         4	From the outside atmosphere or off
         8	Pump commanded on for diagnostics
         */
        //return parseInt( byteA, 2 );

        var byteAvalue = parseInt( byteA, 16 );

        switch ( byteAvalue )
        {
            case 1:
                return {value : 1, name : "Upstream"};
                break;

            case 2:
                return {value : 2, name : "Downstream of catalytic converter"};
                break;

            case 4:
                return {value : 4, name : "From the outside atmosphere or off"};
                break;

            case 8:
                return {value : 8, name : "Pump commanded on for diagnostics"};
                break;

            default :
                return {value : byteAvalue, name : "Invalid response"};
        }
    }
};
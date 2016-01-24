module.exports =
{
    mode:   "01",
    pid:    "03",
    name:   "fuelsys",
    description: "Fuel system 1 and 2 status",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    bytes:  2,
    convertToUseful: function( byteA, byteB )
    {
        var fuelOne = null,
            fuelTwo = null;

        var resultTable = function( result )
        {
            switch ( result )
            {
                case 1:
                    return {value : 1, name : "Open loop due to insufficient engine temperature"};
                    break;

                case 2:
                    return {value : 2, name : "Closed loop, using oxygen sensor feedback to determine fuel mix"};
                    break;

                case 4:
                    return {value : 4, name : "Open loop due to engine load OR fuel cut due to deceleration"};
                    break;

                case 8:
                    return {value : 8, name : "Open loop due to system failure"};
                    break;

                case 16:
                    return {value : 16, name : "Closed loop, using at least one oxygen sensor but there is a fault in the feedback system"};
                    break;

                default :
                    return {value : result, name : "Invalid response"};
            }
        };

        fuelOne = parseInt( byteA, 16 );
        fuelTwo = parseInt( byteB, 16 );

        return {
            one : ( byteA && fuelOne >= 0 ) ? resultTable(fuelOne) : null,
            two : ( byteB && fuelTwo >= 0 ) ? resultTable(fuelTwo) : null
        }
    }
};
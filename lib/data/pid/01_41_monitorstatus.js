module.exports =
{
    mode:   "01",
    pid:    "41",
    name:   "monitorstatus",
    description: "Monitor status this driving cycle",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    polling : false,

    bytes:  4,
    convertToUseful: function( byteA, byteB, byteC, byteD )
    {
        var byteAvalue,
            byteBvalue,
            byteCvalue,
            byteDvalue,
            reply;

        reply = [];
        byteAvalue = parseInt(byteA, 16);

        // The first byte is always zero
        if ( !!byteAvalue )
            return reply;

        // The second, third, and fourth bytes give information about the
        // availability and completeness of certain on-board tests.
        byteBvalue = parseInt(byteB, 16);
        byteCvalue = parseInt(byteC, 16);
        byteDvalue = parseInt(byteD, 16);

        reply = [
            {available : byteBvalue >> 3, incomplete : byteBvalue >> 7, name : "Reserved"},
            {available : byteBvalue >> 2, incomplete : byteBvalue >> 6, name : "Components"},
            {available : byteBvalue >> 1, incomplete : byteBvalue >> 5, name : "Fuel System"},
            {available : byteBvalue >> 0, incomplete : byteBvalue >> 4, name : "Misfire"},

            {available : byteCvalue >> 7, incomplete : byteDvalue >> 7, name : "EGR System"},
            {available : byteCvalue >> 6, incomplete : byteDvalue >> 6, name : "Oxygen Sensor Heater"},
            {available : byteCvalue >> 5, incomplete : byteDvalue >> 5, name : "Oxygen Sensor"},
            {available : byteCvalue >> 4, incomplete : byteDvalue >> 4, name : "A/C Refrigerant"},
            {available : byteCvalue >> 3, incomplete : byteDvalue >> 3, name : "Secondary Air System"},
            {available : byteCvalue >> 2, incomplete : byteDvalue >> 2, name : "Evaporative System"},
            {available : byteCvalue >> 1, incomplete : byteDvalue >> 1, name : "Heated Catalyst"},
            {available : byteCvalue >> 0, incomplete : byteDvalue >> 0, name : "Catalyst"}
        ];

        return reply;
    }
};
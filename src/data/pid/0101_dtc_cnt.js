module.exports =
{
    mode:   "01",
    pid:    "01",
    name:   "dtc_cnt",
    description: "Monitor status since DTCs cleared",

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

        byteAvalue = parseInt(byteA, 16);
        byteBvalue = parseInt(byteB, 16);
        byteCvalue = parseInt(byteC, 16);
        byteDvalue = parseInt(byteD, 16);

        reply = {};

        reply.number   = byteAvalue % 128;
        reply.mil      = byteAvalue >> 7;
        reply.reserved = byteBvalue >> 7;
        reply.spark    = byteBvalue >> 3 == 0 ? 1 : 0;
        reply.compress = byteBvalue >> 3 == 1 ? 1 : 0;

        reply.test = [];

        // Spark ignition
        if ( reply.spark == 1 )
            reply.test = [
                {available : byteB.toString(16) >> 0, incomplete : byteB.toString(16) >> 4, name : "Misfire"},
                {available : byteB >> 0 == 1, incomplete : byteB >> 4 == 1, name : "Misfire"},
                {available : parseInt(byteB >> 0, 16), incomplete : parseInt(byteB >> 4, 16), name : "Misfire"},
                {available : byteBvalue >> 1, incomplete : byteBvalue >> 5, name : "Fuel System"},
                {available : byteBvalue >> 2, incomplete : byteBvalue >> 6, name : "Components"},
                {available : byteCvalue >> 0, incomplete : byteDvalue >> 0, name : "Catalyst"},
                {available : byteCvalue >> 1, incomplete : byteDvalue >> 1, name : "Heated Catalyst"},
                {available : byteCvalue >> 2, incomplete : byteDvalue >> 2, name : "Evaporative System"},
                {available : byteCvalue >> 3, incomplete : byteDvalue >> 3, name : "Secondary Air System"},
                {available : byteCvalue >> 4, incomplete : byteDvalue >> 4, name : "A/C Refrigerant"},
                {available : byteCvalue >> 5, incomplete : byteDvalue >> 5, name : "Oxygen Sensor"},
                {available : byteCvalue >> 6, incomplete : byteDvalue >> 6, name : "Oxygen Sensor Heater"},
                {available : byteCvalue >> 7, incomplete : byteDvalue >> 7, name : "EGR System"}
            ];

        // Compression ignition
        else if ( reply.compress == 1 )
            reply.test = [
                {available : byteBvalue >> 0, incomplete : byteBvalue >> 4, name : "Misfire"},
                {available : byteBvalue >> 1, incomplete : byteBvalue >> 5, name : "Fuel System"},
                {available : byteBvalue >> 2, incomplete : byteBvalue >> 6, name : "Components"},
                {available : byteCvalue >> 0, incomplete : byteDvalue >> 0, name : "NMHC Catalyst"},
                {available : byteCvalue >> 1, incomplete : byteDvalue >> 1, name : "NOx/SCR Monitor"},
                {available : byteCvalue >> 3, incomplete : byteDvalue >> 3, name : "Boost Pressure"},
                {available : byteCvalue >> 5, incomplete : byteDvalue >> 5, name : "Exhaust Gas Sensor"},
                {available : byteCvalue >> 6, incomplete : byteDvalue >> 6, name : "PM filter monitoring"},
                {available : byteCvalue >> 7, incomplete : byteDvalue >> 7, name : "EGR and/or VVT System"}
            ];

        return reply;
    }
};
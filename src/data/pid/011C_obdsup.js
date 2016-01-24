module.exports =
{
    mode:   "01",
    pid:    "1C",
    name:   "obdsup",
    description: "OBD requirements to which vehicle is designed",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        var byteAvalue = parseInt( byteA, 16 );
        var obdList = {
            1  : "OBD-II as defined by the CARB",
            2  : "OBD as defined by the EPA",
            3  : "OBD and OBD-II",
            4  : "OBD-I",
            5  : "Not OBD compliant",
            6  : "EOBD (Europe)",
            7  : "EOBD and OBD-II",
            8  : "EOBD and OBD",
            9  : "EOBD, OBD and OBD II",
            10 : "JOBD (Japan)",
            11 : "JOBD and OBD II",
            12 : "JOBD and EOBD",
            13 : "JOBD, EOBD, and OBD II",
            14 : "Reserved",
            15 : "Reserved",
            16 : "Reserved",
            17 : "Engine Manufacturer Diagnostics (EMD)",
            18 : "Engine Manufacturer Diagnostics Enhanced (EMD+)",
            19 : "Heavy Duty On-Board Diagnostics (Child/Partial) (HD OBD-C)",
            20 : "Heavy Duty On-Board Diagnostics (HD OBD)",
            21 : "World Wide Harmonized OBD (WWH OBD)",
            22 : "Reserved",
            23 : "Heavy Duty Euro OBD Stage I without NOx control (HD EOBD-I)",
            24 : "Heavy Duty Euro OBD Stage I with NOx control (HD EOBD-I N)",
            25 : "Heavy Duty Euro OBD Stage II without NOx control (HD EOBD-II)",
            26 : "Heavy Duty Euro OBD Stage II with NOx control (HD EOBD-II N)",
            27 : "Reserved",
            28 : "Brazil OBD Phase 1 (OBDBr-1)",
            29 : "Brazil OBD Phase 2 (OBDBr-2)",
            30 : "Korean OBD (KOBD)",
            31 : "India OBD I (IOBD I)",
            32 : "India OBD II (IOBD II)",
            33 : "Heavy Duty Euro OBD Stage VI (HD EOBD-IV)"
        };

        if (   1 <= byteAvalue && byteAvalue <=  33 )
            return { value : byteAvalue, name : obdList[ byteAvalue ] };

        if (  34 <= byteAvalue && byteAvalue <= 250 )
            return { value : byteAvalue, name : "Reserved" };

        if ( 251 <= byteAvalue && byteAvalue <= 255 )
            return { value : byteAvalue, name : "Not available for assignment (SAE J1939 special meaning)" };

        return { value : byteAvalue, name : "Invalid response" };
    }
};
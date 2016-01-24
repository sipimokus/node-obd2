module.exports =
{
    mode:   "01",
    pid:    "51",
    name:   "fuel_type",
    description: "Fuel Type",

    min:    0,
    max:    0,
    unit:   "Bit Encoded",

    bytes:  1,
    convertToUseful: function( byteA )
    {
        var byteAvalue,
            resultList,
            result;

        byteAvalue = parseInt( byteA, 16 );
        byteAvalue = 0 <= byteAvalue && byteAvalue <= 23 ? byteAvalue : 0;

        resultList = {
            0  : "Not available",
            1  : "Gasoline",
            2  : "Methanol",
            3  : "Ethanol",
            4  : "Diesel",
            5  : "LPG",
            6  : "CNG",
            7  : "Propane",
            8  : "Electric",
            9  : "Bifuel running Gasoline",
            10 : "Bifuel running Methanol",
            11 : "Bifuel running Ethanol",
            12 : "Bifuel running LPG",
            13 : "Bifuel running CNG",
            14 : "Bifuel running Propane",
            15 : "Bifuel running Electricity",
            16 : "Bifuel running electric and combustion engine",
            17 : "Hybrid gasoline",
            18 : "Hybrid Ethanol",
            19 : "Hybrid Diesel",
            20 : "Hybrid Electric",
            21 : "Hybrid running electric and combustion engine",
            22 : "Hybrid Regenerative",
            23 : "Bifuel running diesel"
        };

        result = {
            id   : byteAvalue,
            name : resultList.valueOf( byteAvalue )
        };

        return result;
    }
};
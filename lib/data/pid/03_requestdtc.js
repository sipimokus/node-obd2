module.exports =
{
    mode:   "03",
    pid:    undefined,
    name:   "requestdtc",
    description: "Requested DTC",

    bytes:  6,
    convertToUseful: function( byteA, byteB, byteC, byteD, byteE, byteF )
    {
        console.log(byteA, byteB, byteC, byteD, byteE, byteF);
        var reply = {};
        reply.errors = [];

        var decodeDTCCode = function( byte1, byte2 ) {
            var codeString = "", firstChar;

            //If 00 00 --> No code.
            if (typeof byte1 == "undefined" || ((byte1 === '00') && (byte2 === '00' || typeof byte2 == "undefined"))) {
                return '-';
            }

            var firstByte = parseInt(byte1, 16);
            var firstCharBytes = firstByte >> 6;
            switch(firstCharBytes) {
                case 0:
                    firstChar = 'P';
                    break;
                case 1:
                    firstChar = 'C';
                    break;
                case 2:
                    firstChar = 'B';
                    break;
                case 3:
                    firstChar = 'U';
                    break;
                default:
                    console.log('Error with DTC');
                    break;
            }
            var secondChar = (firstByte >> 4) % 4;
            var thirdChar = firstByte % 16;
            codeString = firstChar + secondChar + thirdChar + byte2;
            return codeString;
        };

        reply.errors[0] = decodeDTCCode(byteA, byteB);
        reply.errors[1] = decodeDTCCode(byteC, byteD);
        reply.errors[2] = decodeDTCCode(byteE, byteF);

        return reply;
    }
};
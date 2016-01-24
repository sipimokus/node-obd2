module.exports =
{
    mode:   "04",
    pid:    undefined,
    name:   "cleardtc",
    description: "Clear Trouble Codes (Clear engine light)",

    bytes:  0,
    convertToUseful: function( a, b, c, d )
    {
        return String(a) + String(b) + String(c) + String(d);
    }
};
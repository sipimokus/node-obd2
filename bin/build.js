var exec = require('child_process').exec;


var execOut = function( msg )
{
    console.log( msg );
};

exec('bin\\build', execOut);

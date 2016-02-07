var exec = require('child_process').exec;

exec('bin\\build').stdout.on('data', function(data) {
    console.log(data);
});

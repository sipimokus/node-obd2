rmdir /S /Q lib
xcopy src\*.js lib\ /sy

dir src\*.ts /b /s > ts-files.txt
call tsc @ts-files.txt --outDir lib --module commonjs
del ts-files.txt

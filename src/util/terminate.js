var colors_1 = require('colors');
process.on('unhandledRejection', function (reason, promise) {
    console.error('\nAn unhandled rejection has occurred inside Forge:'.red);
    console.error(colors_1["default"].red(reason));
    console.error('\nElectron Forge was terminated. Location:'.red);
    console.error(colors_1["default"].red(JSON.stringify(promise)));
    process.exit(1);
});
process.on('uncaughtException', function (err) {
    if (err && err.message && err.stack) {
        console.error('\nAn unhandled exception has occurred inside Forge:'.red);
        console.error(colors_1["default"].red(err.message));
        console.error(colors_1["default"].red(err.stack));
    }
    else {
        console.error('\nElectron Forge was terminated:'.red);
        console.error(colors_1["default"].red(typeof err === 'string' ? err : JSON.stringify(err)));
    }
    process.exit(1);
});

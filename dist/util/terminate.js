"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
process.on('unhandledRejection', (reason, promise) => {
    console.error('\nAn unhandled rejection has occurred inside Forge:'.red);
    console.error(colors_1.default.red(reason));
    console.error('\nElectron Forge was terminated. Location:'.red);
    console.error(colors_1.default.red(JSON.stringify(promise)));
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    if (err && err.message && err.stack) {
        console.error('\nAn unhandled exception has occurred inside Forge:'.red);
        console.error(colors_1.default.red(err.message));
        console.error(colors_1.default.red(err.stack));
    }
    else {
        console.error('\nElectron Forge was terminated:'.red);
        console.error(colors_1.default.red(typeof err === 'string' ? err : JSON.stringify(err)));
    }
    process.exit(1);
});
//# sourceMappingURL=terminate.js.map
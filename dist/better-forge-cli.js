#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
const async_ora_1 = require("@electron-forge/async-ora");
const commander_1 = __importDefault(require("commander"));
require("./util/terminate");
const check_system_1 = __importDefault(require("./util/check-system"));
const metadata = require('../package.json');
const originalSC = commander_1.default.executeSubCommand.bind(commander_1.default);
commander_1.default.executeSubCommand = (argv, args, unknown) => {
    let indexOfDoubleDash = process.argv.indexOf('--');
    indexOfDoubleDash = indexOfDoubleDash < 0 ? process.argv.length + 1 : indexOfDoubleDash;
    const passThroughArgs = args.filter((arg) => process.argv.indexOf(arg) > indexOfDoubleDash);
    const normalArgs = args.filter((arg) => process.argv.indexOf(arg) <= indexOfDoubleDash);
    let newArgs = args;
    let newUnknown = unknown;
    if (passThroughArgs.length > 0) {
        newArgs = normalArgs.concat(unknown).concat('--').concat(passThroughArgs);
        newUnknown = [];
    }
    return originalSC(argv, newArgs, newUnknown);
};
commander_1.default
    .version(metadata.version)
    .option('--verbose', 'Enables verbose mode')
    .command('make', 'Generate distributables for the current Electron application')
    .command('publish', 'Publish the current Electron application to GitHub')
    .on('command:*', (commands) => {
    // eslint-disable-next-line no-underscore-dangle
    if (!commander_1.default._execs.has(commands[0])) {
        console.error();
        console.error(`Unknown command "${commander_1.default.args.join(' ')}".`);
        console.error('See --help for a list of available commands.');
        process.exit(1);
    }
});
(async () => {
    let goodSystem;
    await async_ora_1.asyncOra('Checking your system', async (ora) => {
        goodSystem = await check_system_1.default(ora);
    });
    if (!goodSystem) {
        console.error((`It looks like you are missing some dependencies you need to get Electron running.
Make sure you have git installed and Node.js version ${metadata.engines.node}`));
        process.exit(1);
    }
    commander_1.default.parse(process.argv);
})();
//# sourceMappingURL=better-forge-cli.js.map
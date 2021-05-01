"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMakeOptions = void 0;
// @ts-ignore
const core_1 = require("@electron-forge/core");
const fs_extra_1 = __importDefault(require("fs-extra"));
// @ts-ignore
const get_1 = require("@electron/get");
const commander_1 = __importDefault(require("commander"));
const path_1 = __importDefault(require("path"));
require("./util/terminate");
const working_dir_1 = __importDefault(require("./util/working-dir"));
// eslint-disable-next-line import/prefer-default-export
async function getMakeOptions() {
    let dir = process.cwd();
    commander_1.default
        .version((await fs_extra_1.default.readJson(path_1.default.resolve(__dirname, '../package.json'))).version)
        .arguments('[cwd]')
        .option('--skip-package', 'Assume the app is already packaged')
        .option('-a, --arch [arch]', 'Target architecture')
        .option('-p, --platform [platform]', 'Target build platform')
        .option('--targets [targets]', 'Override your make targets for this run')
        .option('--write-results [results.json]', 'File to save results')
        .allowUnknownOption(true)
        .action((cwd) => { dir = working_dir_1.default(dir, cwd); })
        .parse(process.argv);
    const makeOpts = {
        dir,
        interactive: true,
        skipPackage: commander_1.default.skipPackage,
    };
    if (commander_1.default.targets)
        makeOpts.overrideTargets = commander_1.default.targets.split(',');
    if (commander_1.default.arch)
        makeOpts.arch = commander_1.default.arch;
    if (commander_1.default.platform)
        makeOpts.platform = commander_1.default.platform;
    return [makeOpts, commander_1.default.writeResults];
}
exports.getMakeOptions = getMakeOptions;
// eslint-disable-next-line no-underscore-dangle
if (require.main === module || global.__LINKED_FORGE__) {
    (async () => {
        const [makeOpts, writeResults] = await getMakeOptions();
        get_1.initializeProxy();
        let result = await core_1.api.make(makeOpts);
        if (writeResults) {
            await fs_extra_1.default.writeJson(writeResults, result);
        }
    })();
}
//# sourceMappingURL=better-forge-cli-make.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@electron-forge/core");
const fs_extra_1 = __importDefault(require("fs-extra"));
const get_1 = require("@electron/get");
const commander_1 = __importDefault(require("commander"));
const path_1 = __importDefault(require("path"));
require("./util/terminate");
const working_dir_1 = __importDefault(require("./util/working-dir"));
const better_forge_cli_make_1 = require("./better-forge-cli-make");
(async () => {
    let dir = process.cwd();
    commander_1.default
        .version((await fs_extra_1.default.readJson(path_1.default.resolve(__dirname, '../package.json'))).version)
        .arguments('[cwd]')
        .option('--target [target[,target...]]', 'The comma-separated deployment targets, defaults to "github"')
        .option('--dry-run', 'Triggers a publish dry run which saves state and doesn\'t upload anything')
        .option('--from-dry-run', 'Attempts to publish artifacts from the last saved dry run')
        .option('--from-make-results [output.json]', 'Attempts to publish artifacts from the last saved dry run')
        .allowUnknownOption(true)
        .action((cwd) => { dir = working_dir_1.default(dir, cwd); })
        .parse(process.argv);
    get_1.initializeProxy();
    const publishOpts = {
        dir,
        interactive: true,
        dryRun: commander_1.default.dryRun,
        dryRunResume: commander_1.default.fromDryRun,
    };
    if (commander_1.default.target)
        publishOpts.publishTargets = commander_1.default.target.split(',');
    publishOpts.makeOptions = (await better_forge_cli_make_1.getMakeOptions())[0];
    if (commander_1.default.fromMakeResults) {
        publishOpts.makeResults = await fs_extra_1.default.readJson(commander_1.default.fromMakeResults);
    }
    await core_1.api.publish(publishOpts);
})();
//# sourceMappingURL=better-forge-cli-publish.js.map
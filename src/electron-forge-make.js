var fs_extra_1 = require('fs-extra');
// @ts-ignore
var get_1 = require('@electron/get');
var commander_1 = require('commander');
var path_1 = require('path');
require('./util/terminate');
var working_dir_1 = require('./util/working-dir');
async;
function getMakeOptions() {
    var dir = process.cwd();
    commander_1["default"]
        .version((await), fs_extra_1["default"].readJson(path_1["default"].resolve(__dirname, '../package.json'))).version;
    arguments('[cwd]')
        .option('--skip-package', 'Assume the app is already packaged')
        .option('-a, --arch [arch]', 'Target architecture')
        .option('-p, --platform [platform]', 'Target build platform')
        .option('--targets [targets]', 'Override your make targets for this run')
        .option('--output [output]', 'File to save results')
        .allowUnknownOption(true)
        .action(function (cwd) { dir = working_dir_1["default"](dir, cwd); })
        .parse(process.argv);
    var makeOpts = {
        dir: dir,
        interactive: true,
        skipPackage: commander_1["default"].skipPackage
    };
    if (commander_1["default"].targets)
        makeOpts.overrideTargets = commander_1["default"].targets.split(',');
    if (commander_1["default"].arch)
        makeOpts.arch = commander_1["default"].arch;
    if (commander_1["default"].platform)
        makeOpts.platform = commander_1["default"].platform;
    return [makeOpts, commander_1["default"].output];
}
// eslint-disable-next-line no-underscore-dangle
if (require.main === module || (global))
    as;
any;
__LINKED_FORGE__;
{
    (async());
    {
        var makeOpts = await[0], output = await[1], getMakeOptions_1 = ();
        get_1.initializeProxy();
        var result = await, api_1, make = (makeOpts);
        if (output)
            console.log(result);
    }
    ();
}

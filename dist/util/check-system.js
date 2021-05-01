"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validPackageManagerVersion = void 0;
const child_process_1 = require("child_process");
const debug_1 = __importDefault(require("debug"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const semver_1 = __importDefault(require("semver"));
const core_1 = require("@electron-forge/core");
const d = debug_1.default('electron-forge:check-system');
async function checkGitExists() {
    return new Promise((resolve) => {
        child_process_1.exec('git --version', (err) => resolve(!err));
    });
}
async function checkNodeVersion(ora) {
    const { engines } = await fs_extra_1.default.readJson(path_1.default.resolve(__dirname, '..', '..', 'package.json'));
    const versionSatisified = semver_1.default.satisfies(process.versions.node, engines.node);
    if (!versionSatisified) {
        ora.warn(`You are running Node.js version ${process.versions.node}, but Electron Forge requires Node.js ${engines.node}.`);
    }
    return versionSatisified;
}
const NPM_WHITELISTED_VERSIONS = {
    all: '^3.0.0 || ^4.0.0 || ~5.1.0 || ~5.2.0 || >= 5.4.2',
    darwin: '>= 5.4.0',
    linux: '>= 5.4.0',
};
const YARN_WHITELISTED_VERSIONS = {
    all: '0.23.3 || 0.24.6 || >= 1.0.0',
    darwin: '0.27.5',
    linux: '0.27.5',
};
function validPackageManagerVersion(packageManager, version, whitelistedVersions, ora) {
    try {
        return semver_1.default.satisfies(version, whitelistedVersions);
    }
    catch (e) {
        ora.warn(`Could not check ${packageManager} version "${version}", assuming incompatible`);
        d(`Exception while checking version: ${e}`);
        return false;
    }
}
exports.validPackageManagerVersion = validPackageManagerVersion;
function warnIfPackageManagerIsntAKnownGoodVersion(packageManager, version, whitelistedVersions, ora) {
    const osVersions = whitelistedVersions[process.platform];
    const versions = osVersions ? `${whitelistedVersions.all} || ${osVersions}` : whitelistedVersions.all;
    const versionString = version.toString();
    if (!validPackageManagerVersion(packageManager, versionString, versions, ora)) {
        ora.warn(`You are using ${packageManager}, but not a known good version.
The known versions that work with Electron Forge are: ${versions}`);
    }
}
async function checkPackageManagerVersion(ora) {
    const version = await core_1.utils.yarnOrNpmSpawn(['--version']);
    const versionString = version.toString();
    if (core_1.utils.hasYarn()) {
        warnIfPackageManagerIsntAKnownGoodVersion('Yarn', versionString, YARN_WHITELISTED_VERSIONS, ora);
    }
    else {
        warnIfPackageManagerIsntAKnownGoodVersion('NPM', versionString, NPM_WHITELISTED_VERSIONS, ora);
    }
    return true;
}
/**
 * Some people know their system is OK and don't appreciate the 800ms lag in
 * start up that these checks (in particular the package manager check) costs.
 *
 * Simply creating this flag file in your home directory will skip these checks
 * and shave ~800ms off your forge start time.
 *
 * This is specifically not documented or everyone would make it.
 */
const SKIP_SYSTEM_CHECK = path_1.default.resolve(os_1.default.homedir(), '.skip-forge-system-check');
async function checkSystem(ora) {
    if (!await fs_extra_1.default.pathExists(SKIP_SYSTEM_CHECK)) {
        d('checking system, create ~/.skip-forge-system-check to stop doing this');
        return (await Promise.all([
            checkGitExists(),
            checkNodeVersion(ora),
            checkPackageManagerVersion(ora),
        ])).every((check) => check);
    }
    d('skipping system check');
    return true;
}
exports.default = checkSystem;
//# sourceMappingURL=check-system.js.map
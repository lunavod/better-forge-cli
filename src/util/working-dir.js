var fs_extra_1 = require('fs-extra');
var path_1 = require('path');
function workingDir(dir, cwd, checkExisting) {
    if (checkExisting === void 0) { checkExisting = true; }
    var finalDir = dir;
    if (cwd) {
        if (path_1["default"].isAbsolute(cwd) && (!checkExisting || fs_extra_1["default"].existsSync(cwd))) {
            finalDir = cwd;
        }
        else {
            var resolved = path_1["default"].resolve(finalDir, cwd);
            if (!checkExisting || fs_extra_1["default"].existsSync(resolved)) {
                finalDir = resolved;
            }
        }
    }
    return finalDir;
}
exports["default"] = workingDir;

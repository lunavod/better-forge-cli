"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function workingDir(dir, cwd, checkExisting = true) {
    let finalDir = dir;
    if (cwd) {
        if (path_1.default.isAbsolute(cwd) && (!checkExisting || fs_extra_1.default.existsSync(cwd))) {
            finalDir = cwd;
        }
        else {
            const resolved = path_1.default.resolve(finalDir, cwd);
            if (!checkExisting || fs_extra_1.default.existsSync(resolved)) {
                finalDir = resolved;
            }
        }
    }
    return finalDir;
}
exports.default = workingDir;
//# sourceMappingURL=working-dir.js.map
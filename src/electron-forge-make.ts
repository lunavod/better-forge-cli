// @ts-ignore
import { api, MakeOptions } from '@electron-forge/core';

import fs from 'fs-extra';
// @ts-ignore
import { initializeProxy } from '@electron/get';
import program from 'commander';
import path from 'path';

import './util/terminate';
import workingDir from './util/working-dir';

// eslint-disable-next-line import/prefer-default-export
export async function getMakeOptions(): Promise<[MakeOptions, string|undefined]> {
  let dir = process.cwd();
  program
    .version((await fs.readJson(path.resolve(__dirname, '../package.json'))).version)
    .arguments('[cwd]')
    .option('--skip-package', 'Assume the app is already packaged')
    .option('-a, --arch [arch]', 'Target architecture')
    .option('-p, --platform [platform]', 'Target build platform')
    .option('--targets [targets]', 'Override your make targets for this run')
    .option('--write-results [results.json]', 'File to save results')
    .allowUnknownOption(true)
    .action((cwd) => { dir = workingDir(dir, cwd); })
    .parse(process.argv);

  const makeOpts: MakeOptions = {
    dir,
    interactive: true,
    skipPackage: program.skipPackage,
  };
  if (program.targets) makeOpts.overrideTargets = program.targets.split(',');
  if (program.arch) makeOpts.arch = program.arch;
  if (program.platform) makeOpts.platform = program.platform;

  return [makeOpts, program.writeResults];
}

// eslint-disable-next-line no-underscore-dangle
if (require.main === module || (global as any).__LINKED_FORGE__) {
  (async () => {
    const [makeOpts, writeResults] = await getMakeOptions();

    initializeProxy();

    let result = await api.make(makeOpts);
    if (writeResults) {
      await fs.writeJson(writeResults, result)
    }
  })();
}

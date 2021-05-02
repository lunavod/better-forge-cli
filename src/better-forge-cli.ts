#!/usr/bin/env node
import 'colors';

import {asyncOra, OraImpl} from '@electron-forge/async-ora';
import program from 'commander';

import './util/terminate';

import checkSystem from './util/check-system';

const metadata = require('../package.json');

const originalSC = program.executeSubCommand.bind(program);
program.executeSubCommand = (argv: string[], args: string[], unknown: string[]) => {
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

program
  .version(metadata.version)
  .option('--verbose', 'Enables verbose mode')
  .command('make', 'Generate distributables for the current Electron application')
  .command('publish', 'Publish the current Electron application to GitHub')
  .on('command:*', (commands) => {
    // eslint-disable-next-line no-underscore-dangle
    if (!program._execs.has(commands[0])) {
      console.error();
      console.error(`Unknown command "${program.args.join(' ')}".`);
      console.error('See --help for a list of available commands.');
      process.exit(1);
    }
  });

(async () => {
  let goodSystem;
  await asyncOra('Checking your system', async (ora: OraImpl) => {
    goodSystem = await checkSystem(ora);
  });

  if (!goodSystem) {
    console.error((`It looks like you are missing some dependencies you need to get Electron running.
Make sure you have git installed and Node.js version ${metadata.engines.node}`));
    process.exit(1);
  }

  program.parse(process.argv);
})();

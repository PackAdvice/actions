import * as core from '@actions/core';
import * as inputs from './inputs';
import { downloadLatestArtifact } from './download_executable';
import * as fs from 'fs';
import { exec } from '@actions/exec';
import comment from './comment';
import WorkingDirectory from './working_directory';

async function run() {
  const working_directory = new WorkingDirectory();
  const version = core.getInput(inputs.Version);
  switch (version) {
    case 'latest': {
      await downloadLatestArtifact(
        working_directory,
        'sya-ri',
        'PackAdvice',
        'master',
        23192113,
        'PackAdvice executable (Linux, x64)'
      );
      break;
    }
    default: {
      core.setFailed(`Not found version: ${version}`);
    }
  }
  fs.chmodSync(working_directory.packadvice, '755');
  core.startGroup('PackAdvice version');
  await exec(working_directory.packadvice, ['--version']);
  core.endGroup();
  core.startGroup('PackAdvice output');
  await exec(working_directory.packadvice, ['--output', working_directory.output, core.getInput(inputs.Path)]);
  core.endGroup();
  if (core.getBooleanInput(inputs.Comment)) {
    await comment(fs.readFileSync(working_directory.output, { encoding: 'utf8' }));
  }
}

run();

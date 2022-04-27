import * as core from '@actions/core';
import * as inputs from './inputs';
import { downloadLatestArtifact } from './download_executable';
import * as fs from 'fs';
import { exec } from '@actions/exec';
import * as path from 'path';
import * as os from 'os';
import comment from './comment';

async function run() {
  const version = core.getInput(inputs.Version);
  let packadvicePath: string | null = null;
  switch (version) {
    case 'latest': {
      packadvicePath = await downloadLatestArtifact(
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
  if (!packadvicePath) {
    core.setFailed('Failed to download the executable file.');
    return;
  }
  fs.chmodSync(packadvicePath, '755');
  core.startGroup('PackAdvice version');
  await exec(packadvicePath, ['--version']);
  core.endGroup();
  const outputPath = path.join(os.tmpdir(), 'result.md');
  core.startGroup('PackAdvice output');
  await exec(packadvicePath, ['--output', outputPath, core.getInput(inputs.Path)]);
  core.endGroup();
  if (core.getBooleanInput(inputs.Comment)) {
    await comment(fs.readFileSync(outputPath, { encoding: 'utf8' }));
  }
}

run();

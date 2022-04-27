import * as core from '@actions/core';
import * as github from '@actions/github';
import { exec } from '@actions/exec';
import * as inputs from './inputs';
import * as fs from 'fs';
import * as unzipper from 'unzipper';
import { mkdtempSync } from 'fs';
import * as os from 'os';
import * as path from 'path';

export async function downloadLatestArtifact(
  owner: string,
  repo: string,
  branch: string,
  workflow_id: number,
  artifact_name: string
): Promise<string | null> {
  core.info(`Downloading latest ${artifact_name} artifact`);
  const octokit = github.getOctokit(core.getInput(inputs.Token));
  core.debug(
    `Getting API endpoint for latest ${artifact_name} artifact (repository: ${owner}/${repo}, branch: ${branch}, workflow ID: ${workflow_id})`
  );
  const workflows = await octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
    owner: owner,
    repo: repo
  });
  const latestRun = workflows.data.workflow_runs
    .filter(
      j =>
        j.head_branch === branch &&
        j.workflow_id === workflow_id &&
        j.status === 'completed' &&
        j.conclusion === 'success'
    )
    .sort(j => j.run_number)[0];
  if (!latestRun) {
    core.info(
      `Could not get the information API endpoint for the latest ${artifact_name} artifacts`
    );
    return null;
  }
  core.debug(`Getting latest ${artifact_name} artifact download URL from endpoint`);
  const artifacts = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts',
    {
      owner: owner,
      repo: repo,
      run_id: latestRun.id
    }
  );
  const artifact = artifacts.data.artifacts.filter(j => j.name === artifact_name)[0];
  if (!artifact) {
    core.info(
      `Could not get the download URL for the latest ${artifact_name} artifact (#${latestRun.run_number})`
    );
    return null;
  }
  const zip = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}',
    {
      owner: owner,
      repo: repo,
      artifact_id: artifact.id,
      archive_format: 'zip'
    }
  );
  core.debug(`Extracting ${artifact_name} artifact archive (#${latestRun.run_number})`);
  const dir = mkdtempSync(path.join(os.tmpdir(), 'packadvice-'));
  const zipPath = path.join(dir, 'artifact.zip');
  if (await exec('curl', ['-sSL', '-o', zipPath, zip.url], { silent: true })) {
    core.info(`Could not download the latest ${artifact_name} artifact`);
    return null;
  }
  const packadvicePath = path.join(dir, 'packadvice');
  fs.createReadStream(zipPath).pipe(unzipper.Extract({ path: packadvicePath }));
  core.info(`Successfully downloaded the latest ${artifact_name} artifact`);
  return packadvicePath;
}

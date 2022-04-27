import * as core from '@actions/core';
import * as inputs from './inputs';
import * as github from '@actions/github';

function getSha() {
  const sha = core.getInput(inputs.CommentSha);
  if (sha) return sha;
  return headSha();
}

function headSha() {
  if (github.context.eventName === 'pull_request') {
    return github.context.payload.pull_request!!.head.sha;
  } else {
    return github.context.sha;
  }
}

async function comment(body: string) {
  try {
    const [owner, repo] = core.getInput(inputs.CommentRepository).split('/');
    const sha = getSha();
    const comment_body = core.getInput(inputs.CommentFormat).replace('{body}', body);
    const octokit = github.getOctokit(core.getInput(inputs.Token));
    await octokit.rest.repos.createCommitComment({
      owner: owner,
      repo: repo,
      commit_sha: sha,
      body: comment_body
    });
  } catch (err: any) {
    core.setFailed(err);
  }
}

export default comment;

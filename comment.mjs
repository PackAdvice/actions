import { inspect } from "util";
import { readFileSync } from 'fs';
import core from "@actions/core";
import github from "@actions/github";

function getSha() {
    if (github.context.eventName === "pull_request") {
        return github.context.payload.pull_request.head.sha;
    } else {
        return github.context.sha;
    }
}

async function run() {
    try {
        const inputs = {
            token: core.getInput("token"),
            repository: core.getInput("comment_repository"),
            sha: core.getInput("comment_sha"),
            body: readFileSync(`${process.argv[2]}`, { encoding: 'utf8' }),
        };
        core.debug(`Inputs: ${inspect(inputs)}`);

        const [owner, repo] = inputs.repository.split("/");

        const sha = inputs.sha ? inputs.sha : getSha();
        core.debug(`SHA: ${sha}`);

        const octokit = github.getOctokit(inputs.token);

        await octokit.rest.repos.createCommitComment({
            owner: owner,
            repo: repo,
            commit_sha: sha,
            body: inputs.body
        });
    } catch (error) {
        core.debug(inspect(error));
        core.setFailed(error.message);
    }
}

run();

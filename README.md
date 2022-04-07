# PackAdvice-action

A GitHub actions that provides advice for improving Minecraft Java Edition resource pack.

## Options

| Name                 | Default                                              | Description                                                       |
|----------------------|------------------------------------------------------|-------------------------------------------------------------------|
| `token`              | `${{ github.token }}`                                | The GitHub authentication token.                                  |
| `path`               | `.`                                                  | Relative path from the repository root to the pack directory.     |
| `version`            | `latest`                                             | The PackAdvice version the action will use.                       |
| `comment`            | `true`                                               | If true, enable a result comment on the commit.                   |
| `comment_repository` | `${{ github.repository }}`                           | If commit option is true, the full name of the target repository. |
| `comment_sha`        | `github.sha` or `github.event.pull_request.head.sha` | If commit option is true, the commit SHA.                         |

## Example

```yaml
name: PackAdvice
on: [push]
jobs:
  packadvice:
    runs-on: ubuntu-latest
    steps:
      - name: Clone repository
        uses: actions/checkout@v3
      - name: Run PackAdvice
        uses: PackAdvice/actions@v1
```

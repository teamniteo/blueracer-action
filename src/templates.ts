import * as github from '@actions/github'
import dedent from 'dedent'

function relDiff(a: number, b: number): number {
  return (100 * (a - b)) / ((a + b) / 2)
}

export function fromTemplate(
  defaultSize: number,
  defaultSum: number,
  numberOfCommits: number,
  currentSum: number,
  currentSize: number,
  diffWarn: number,
  diffError: number
): string | PromiseLike<string> {
  const diff100Default = (100 * defaultSum) / defaultSize
  const diff100Current = (100 * currentSum) / currentSize

  const diffSize = relDiff(currentSize, defaultSize)
  const totalDurationDiff = relDiff(currentSum, defaultSum)
  const diff100 = relDiff(diff100Current, diff100Default)

  const sha = github.context.sha
  const baseURL =
    github.context.payload.pull_request &&
    github.context.payload.pull_request.base.repo.html_url
  const baseBranch =
    github.context.payload.pull_request &&
    github.context.payload.pull_request.base.ref
  const prBranch =
    github.context.payload.pull_request &&
    github.context.payload.pull_request.head.ref

  const url = `${baseURL}/commit/${sha}`
  const currentDiff = diffSize.toFixed(0)

  let icon = '✅'
  let msg = 'Everything looks great, carry on!'

  if (totalDurationDiff > diffWarn) {
    icon = '👀'
    msg = `Your tests appear to be *a bit slower* than average in the \`${baseBranch}\` branch. Could be worth a look?`
  }
  if (totalDurationDiff > diffError) {
    icon = '❌'
    msg = `Whoa, hold your horses! This pull request is really slowing down your tests! Are you sure you want to merge it?`
  }

  if (diffSize > 10) {
    icon = '✅'
  }

  return dedent`### BlueRacer unit tests performance report: ${icon}
  ${msg}
  
  Here are some details:
  
  | Branch | Number of tests | Total duration | Duration per 100 tests |
  |-|-|-|-|
  | \`${baseBranch}\`[^1]|${defaultSize}|${defaultSum.toFixed(
    1
  )}s | ${diff100Default.toFixed(0)}s |
  | \`${prBranch}\`[^2]|${currentSize} (${currentDiff}%)|${currentSum.toFixed(
    1
  )}s (${totalDurationDiff.toFixed(0)}%) | ${diff100Current.toFixed(
    1
  )}s (${diff100.toFixed(0)}%) |
  
  [^1]: The previous ${numberOfCommits} runs.
  [^2]: More specifically, [commit \`${sha}\`](${url}).
  `
}

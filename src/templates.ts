import * as github from '@actions/github'
import dedent from 'dedent'

function relDiff(a: number, b: number): number {
  return (100 * (a - b)) / ((a + b) / 2)
}

export function fromTemplate(
  baseCount: number,
  medianDefault: number,
  medianDefaultSize: number,
  currentSum: number,
  currentSize: number
): string | PromiseLike<string> {
  const currentDiffSize = relDiff(currentSize, medianDefaultSize)
  const currentDiffMedian = relDiff(currentSum, medianDefault)
  const baseCountDiff = relDiff(baseCount, currentSize)

  let icon = '✅'
  if (currentDiffMedian > 10) {
    icon = '👀'
  }
  if (currentDiffMedian > 30) {
    icon = '❌'
  }
  if (baseCountDiff > 10) {
    icon = '✅'
  }

  return dedent`### BlueRacer unit tests performance report: ${icon}
  Everything looks great, carry on!
  
  Here are some details:
  
  | Branch | Number of tests | Total duration
  |-|-|-|-|
  | \`default branch\`[^1]|${medianDefaultSize}|${medianDefault.toFixed(1)}s
  | \`${github.context.ref}\`[^2]|${currentSize} (${currentDiffSize.toFixed(
    0
  )}%)|${currentSum.toFixed(1)}s (${currentDiffMedian.toFixed(0)}%)
  
  [^1]: The previous ${baseCount} runs.
  [^2]: More specifically, [commit \`${
    github.context.sha
  }\`](https://github.com/teamniteo/blueracer/commit/${github.context.sha}).
  `
}

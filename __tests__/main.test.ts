import {getDefaultBranchStats} from '../src/csv'
import {fromTemplate} from '../src/templates'
import {expect, test} from '@jest/globals'
import {median, sum} from 'simple-statistics'
import dedent from 'dedent'
import * as github from '@actions/github'

github.context.ref = 'refs/heads/main'
github.context.sha = '1234'

test('get fixture stats', async () => {
  const results: Map<string, Array<number>> = await getDefaultBranchStats(
    __dirname + '/fixtures'
  )
  // Summary of tests duration for each branch commit
  const sums = [...results.values()].map(tests => {
    return sum(tests)
  })
  // Summary of tests duration for each branch commit
  const countTests = [...results.values()].map(tests => {
    return tests.length
  })

  expect(median(sums)).toEqual(3.9119861639999964)
  expect(median(countTests)).toEqual(164)
})

test('fromTemplate rendering ok', async () => {
  const res = fromTemplate(42, 300, 200, 250, 190)
  expect(res).toEqual(dedent`### BlueRacer unit tests performance report: ✅
  Everything looks great, carry on!

  Here are some details:

  | Branch | Number of tests | Total duration
  |-|-|-|-|
  | \`default branch\`[^1]|200|300.0s
  | \`refs/heads/main\`[^2]|190 (-5%)|250.0s (-18%)

  [^1]: The previous 42 runs.
  [^2]: More specifically, [commit \`1234\`](https://github.com/teamniteo/blueracer/commit/1234).`)
})

test('fromTemplate rendering meh', async () => {
  const res = fromTemplate(42, 300, 200, 350, 215)
  expect(res).toEqual(dedent`### BlueRacer unit tests performance report: 👀
  Everything looks great, carry on!

  Here are some details:

  | Branch | Number of tests | Total duration
  |-|-|-|-|
  | \`default branch\`[^1]|200|300.0s
  | \`refs/heads/main\`[^2]|215 (7%)|350.0s (15%)

  [^1]: The previous 42 runs.
  [^2]: More specifically, [commit \`1234\`](https://github.com/teamniteo/blueracer/commit/1234).`)
})

test('fromTemplate rendering fail', async () => {
  const res = fromTemplate(42, 300, 200, 950, 215)
  expect(res).toEqual(dedent`### BlueRacer unit tests performance report: ❌
  Everything looks great, carry on!

  Here are some details:

  | Branch | Number of tests | Total duration
  |-|-|-|-|
  | \`default branch\`[^1]|200|300.0s
  | \`refs/heads/main\`[^2]|215 (7%)|950.0s (104%)

  [^1]: The previous 42 runs.
  [^2]: More specifically, [commit \`1234\`](https://github.com/teamniteo/blueracer/commit/1234).`)
})

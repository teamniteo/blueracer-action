import {fromTemplate} from '../src/templates'
import {expect, test} from '@jest/globals'
import dedent from 'dedent'
import * as github from '@actions/github'
import * as fs from 'fs'
import * as path from 'path'

const PR = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'pr.json')).toString()
)

github.context.ref = PR.ref
github.context.sha = PR.sha
github.context.payload = PR.payload

test('fromTemplate rendering ok', async () => {
  const res = fromTemplate(200, 300, 42, 250, 190, 10, 30)
  expect(res).toEqual(dedent`### BlueRacer unit tests performance report: ✅
  Everything looks great, carry on!

  Here are some details:

  | Branch | Number of tests | Total duration | Duration per 100 tests |
  |-|-|-|-|
  | \`master\`[^1]|200|300.0s | 150s |
  | \`test/blueracer-v1\`[^2]|190 (-5%)|250.0s (-18%) | 131.6s (-13%) |

  [^1]: The previous 42 runs.
  [^2]: More specifically, [commit \`f9a8408029fa50468a4c98fefa42b8acd6eb8220\`](https://github.com/teamniteo/minisites/commit/f9a8408029fa50468a4c98fefa42b8acd6eb8220).`)
})

test('fromTemplate rendering meh', async () => {
  const res = fromTemplate(200, 300, 42, 350, 215, 10, 30)
  expect(res).toEqual(dedent`### BlueRacer unit tests performance report: 👀
  Your tests appear to be *a bit slower* than average in the \`master\` branch. Could be worth a look?

  Here are some details:

  | Branch | Number of tests | Total duration | Duration per 100 tests |
  |-|-|-|-|
  | \`master\`[^1]|200|300.0s | 150s |
  | \`test/blueracer-v1\`[^2]|215 (7%)|350.0s (15%) | 162.8s (8%) |

  [^1]: The previous 42 runs.
  [^2]: More specifically, [commit \`f9a8408029fa50468a4c98fefa42b8acd6eb8220\`](https://github.com/teamniteo/minisites/commit/f9a8408029fa50468a4c98fefa42b8acd6eb8220).`)
})

test('fromTemplate rendering fail', async () => {
  const res = fromTemplate(200, 300, 42, 950, 215, 10, 30)
  expect(res).toEqual(dedent`### BlueRacer unit tests performance report: ❌
  Whoa, hold your horses! This pull request is really slowing down your tests! Are you sure you want to merge it?

  Here are some details:

  | Branch | Number of tests | Total duration | Duration per 100 tests |
  |-|-|-|-|
  | \`master\`[^1]|200|300.0s | 150s |
  | \`test/blueracer-v1\`[^2]|215 (7%)|950.0s (104%) | 441.9s (99%) |

  [^1]: The previous 42 runs.
  [^2]: More specifically, [commit \`f9a8408029fa50468a4c98fefa42b8acd6eb8220\`](https://github.com/teamniteo/minisites/commit/f9a8408029fa50468a4c98fefa42b8acd6eb8220).`)
})

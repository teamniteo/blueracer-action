import {getDefaultBranchStats} from '../src/csv'
import {expect, test} from '@jest/globals'
import {median, sum} from 'simple-statistics'
import * as github from '@actions/github'
import * as fs from 'fs'
import * as path from 'path'

const PR = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'pr.json')).toString()
)

github.context.ref = PR.ref
github.context.sha = PR.sha
github.context.payload = PR.payload

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

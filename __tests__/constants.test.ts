import {expect, test} from '@jest/globals'
import {defualtBranchSHA, defualtBranchSHABefore} from '../src/constants'
import * as github from '@actions/github'
import * as fs from 'fs'
import * as path from 'path'

const MASTER = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'default.json')).toString()
)

github.context.ref = MASTER.ref
github.context.sha = MASTER.sha
github.context.payload = MASTER.payload

test('get sha for cache restore', async () => {
  expect(defualtBranchSHA()).toEqual('b629b84bdcfd917ded87409cd7406712ae7e1dad')
  expect(defualtBranchSHABefore()).toEqual(
    '5ba7a84840dcc723cca6d0a70cccbde49e6584ef'
  )
})

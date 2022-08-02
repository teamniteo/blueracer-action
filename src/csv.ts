import {parse} from 'csv-parse'
import * as core from '@actions/core'
import {promises as fsA} from 'fs'
import * as fs from 'fs'
import * as Path from 'path'

export async function getDefaultBranchStats(
  path: string
): Promise<Map<string, number[]>> {
  const defaultBranch = new Map<string, number[]>()

  const files = await fsA.readdir(path)
  for await (const file of files) {
    const fullPath = Path.join(path, file)
    const key = Path.basename(file)
    const base = await durationsCSV(fullPath)
    defaultBranch.set(key, base)
  }
  return defaultBranch
}

export async function durationsCSV(file: string): Promise<number[]> {
  const testDurations: number[] = []
  return await new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(parse({delimiter: ',', from_line: 2}))
      .on('data', row => {
        core.debug(row)
        testDurations.push(parseFloat(row[1]))
      })
      .on('error', err => {
        reject(err)
      })
      .on('end', () => {
        resolve(testDurations)
      })
  })
}

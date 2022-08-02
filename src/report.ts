import path from 'path'
import {cwd} from 'process'
import {median, sum} from 'simple-statistics'
import {durationsCSV, getDefaultBranchStats} from './csv'
import {fromTemplate} from './templates'
import * as C from './constants'

export async function report(file: string): Promise<string> {
  const results: Map<string, number[]> = await getDefaultBranchStats(
    path.join(cwd(), C.reportsPath)
  )

  // Summary of tests duration for each branch commit
  const sums = [...results.values()].map(tests => {
    return sum(tests)
  })
  // Summary of tests duration for each branch commit
  const countTests = [...results.values()].map(tests => {
    return tests.length
  })

  const medianNumberOfTests = median(countTests)
  const medianDefault = median(sums)

  const current = await durationsCSV(file)
  const currentSum = sum(current)

  return fromTemplate(
    medianNumberOfTests,
    medianDefault,
    results.size,
    currentSum,
    current.length
  )
}

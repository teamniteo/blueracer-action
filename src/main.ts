import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'
import * as github from '@actions/github'
import {report} from './report'
import {restore, storeAndGC} from './build'
import {cwd} from 'process'

async function run(): Promise<void> {
  try {
    const file: string = path.join(cwd(), core.getInput('durations-file'))

    const ref = github.context.ref

    // on default branch
    if (ref.includes('refs/heads/')) {
      if (fs.existsSync(file)) {
        core.debug(`Storing ${file} ...`)
        storeAndGC(file)
        return
      }
      core.debug(`${file} not found skipping...`)
      return
    } else {
      // PR
      const masterDataPresent = await restore()
      if (!masterDataPresent) {
        core.setOutput(
          'report',
          'No data yet, run this action in default branch.'
        )
        return
      }
      core.debug(`Processing ${file} ...`)
      core.debug(new Date().toTimeString())

      const md: string = await report(file)
      core.setOutput('report', md)
      core.debug(md)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()

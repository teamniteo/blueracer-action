import * as github from '@actions/github'
import * as cache from '@actions/cache'
import * as io from '@actions/io'
import * as C from './constants'
import * as path from 'path'

export async function restore(): Promise<boolean> {
  io.mkdirP(C.reportsPath)
  return cache.restoreCache([C.reportsPath], C.reportsKey) !== undefined
}

export async function storeAndGC(file: string): Promise<void> {
  io.mkdirP(C.reportsPath)
  await cache.restoreCache([C.reportsPath], C.reportsKey)
  io.cp(file, path.join(C.reportsPath, `${github.context.sha}.csv`))

  // keep newest 100 files
  // exec.exec('bash', [
  //   '-c',
  //   `"cd ${C.reportsPath} && ls -tr | head -n -100 | xargs --no-run-if-empty rm"`
  // ])
  await cache.saveCache([C.reportsPath], C.reportsKey)

  io.rmRF(C.reportsPath)
}

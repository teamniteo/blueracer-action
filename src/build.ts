import * as core from '@actions/core'
import * as github from '@actions/github'
import * as cache from '@actions/cache'
import * as io from '@actions/io'
import * as C from './constants'
import * as path from 'path'
import * as fs from 'fs'

export async function restore(): Promise<boolean> {
  io.mkdirP(C.reportsPath)
  const cacheHit =
    (await cache.restoreCache([C.reportsPath], C.reportsKey)) !== undefined
  const reportsPath = path.join(process.cwd(), C.reportsPath)
  const files = fs.readdirSync(reportsPath)
  core.debug(`Current reportsPath ${reportsPath}`)
  core.debug(`Current cacheHit ${cacheHit}`)
  core.debug(`Current reportsPath`)
  core.debug(files.join('\n'))

  return cacheHit && files.length > 0
}

export async function storeAndGC(file: string): Promise<void> {
  io.mkdirP(C.reportsPath)

  // Restore old cache
  const cacheHit = await cache.restoreCache([C.reportsPath], C.reportsKeyBefore)

  io.cp(file, path.join(C.reportsPath, `${github.context.sha}.csv`))

  // keep newest 100 files
  // exec.exec('bash', [
  //   '-c',
  //   `"cd ${C.reportsPath} && ls -tr | head -n -100 | xargs --no-run-if-empty rm"`
  // ])

  // save as new cache
  await cache.saveCache([C.reportsPath], C.reportsKey)

  const reportsPath = path.join(process.cwd(), C.reportsPath)
  const files = fs.readdirSync(reportsPath)
  core.debug(`Current reportsPath ${reportsPath}`)
  core.debug(`Current cacheHit ${cacheHit}`)
  core.debug(`Current reportsPath`)
  core.debug(files.join('\n'))

  io.rmRF(C.reportsPath)
}

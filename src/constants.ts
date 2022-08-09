import * as github from '@actions/github'

export function defualtBranchSHA(): string {
  return (
    (github.context.payload.pull_request &&
      github.context.payload.pull_request.base.sha) ||
    github.context.sha
  )
}

export function defualtBranchSHABefore(): string {
  return github.context.payload.before || github.context.sha
}

export const reportsPath = '.blueracer-reports'
export const reportsKey = `blueracer-reports-${defualtBranchSHA()}`
export const reportsKeyBefore = `blueracer-reports-${defualtBranchSHABefore()}`

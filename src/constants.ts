import * as github from '@actions/github'

const defualtBranchSHA =
  (github.context.payload.pull_request &&
    github.context.payload.pull_request.base.sha) ||
  github.context.sha

export const reportsPath = '.blueracer-reports'
export const reportsKey = `blueracer-reports-${defualtBranchSHA}`

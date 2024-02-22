const cp = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const apps = fs.readdirSync(path.resolve(__dirname, 'apps'))
const packages = fs.readdirSync(path.resolve(__dirname, 'packages'))
const scopes = Array.from(new Set([...apps, ...packages]))

const gitStatus = cp.execSync('git status --porcelain || true').toString().trim().split('\n')

const scopeComplete = gitStatus
  .find((r) => ~r.indexOf('M  apps') || ~r.indexOf('M  packages'))
  ?.replace(/\//g, '%%')
  ?.match(/(apps|packages)%%((\w|-)*)/)?.[1]

/** @type {import('cz-git').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    scopes,
    defaultScope: scopeComplete,
    customScopesAlign: scopeComplete ? 'bottom' : 'top',
    allowCustomIssuePrefixs: false,
    allowEmptyIssuePrefixs: false
  }
}

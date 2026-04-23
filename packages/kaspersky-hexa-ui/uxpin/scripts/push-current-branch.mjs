import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const args = process.argv.slice(2)
const hasExplicitBranch = args.includes('--branch') || args.some((arg) => arg.startsWith('--branch='))
const branchArgs = []

if (!hasExplicitBranch) {
  const currentBranch = execFileSync('git', ['branch', '--show-current'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim()

  if (!currentBranch) {
    console.error('Unable to determine the current git branch. Pass --branch explicitly to continue.')
    process.exit(1)
  }

  branchArgs.push('--branch', currentBranch)
}

const scriptDir = dirname(fileURLToPath(import.meta.url))
const cliCommand = resolve(
  scriptDir,
  `../../node_modules/.bin/uxpin-merge${process.platform === 'win32' ? '.cmd' : ''}`
)

const result = spawnSync(cliCommand, ['push', ...branchArgs, ...args], {
  stdio: 'inherit'
})

if (result.error) {
  console.error(result.error.message)
}

if (result.signal) {
  process.kill(process.pid, result.signal)
}

process.exit(result.status ?? 1)

#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const args = new Set(process.argv.slice(2))
const asJson = args.has('--json')
const strict = args.has('--strict')

const packageRoot = process.cwd()
const srcRoot = path.join(packageRoot, 'src')
const designControlsPath = path.join(packageRoot, 'helpers', 'resolveDesignControls.ts')

const componentDirs = fs.readdirSync(srcRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !name.startsWith('@') && name !== 'helpers')
  .sort()

const designControlKeys = readDesignControlKeys(designControlsPath)

const results = componentDirs.map((componentName) => {
  const componentDir = path.join(srcRoot, componentName)
  const files = collectFiles(componentDir)
  const indexPath = path.join(componentDir, 'index.ts')
  const indexText = safeRead(indexPath)
  const sourceModules = collectSourceModules(componentDir)
  const typeFiles = files.filter((filePath) => /(^|\/)types\.tsx?$/.test(toPosix(path.relative(componentDir, filePath))))
  const metaPath = resolveMetaPath(componentDir)
  const meta = metaPath ? readJson(metaPath) : null
  const designControlKey = resolveDesignControlKey(componentName)

  const hasExportStarFromTypes = /export\s+\*\s+from\s+['"]\.\/types['"]/.test(indexText)
  const hasTypesFile = typeFiles.length > 0
  const typesText = typeFiles.map((filePath) => safeRead(filePath)).join('\n')
  const hasPropsInTypes = /export\s+(type|interface)\s+[A-Za-z0-9_]*Props\b/.test(typesText)
  const hasInlineProps = sourceModules.some((module) => /export\s+(type|interface)\s+[A-Za-z0-9_]*Props\b/.test(module.text))
  const hasPropsExport = /Props\b/.test(indexText) ||
    (hasExportStarFromTypes && hasPropsInTypes) ||
    sourceModules.some((module) => {
      if (!/export\s+(type|interface)\s+[A-Za-z0-9_]*Props\b/.test(module.text)) return false

      const exportStarPattern = new RegExp(`export\\s+\\*\\s+from\\s+['"]\\./${escapeRegExp(module.name)}['"]`)
      return exportStarPattern.test(indexText)
    })

  const facts = {
    component: componentName,
    hasIndex: fs.existsSync(indexPath),
    hasTypesFile: hasTypesFile || hasInlineProps,
    hasPropsExport,
    hasStory: files.some((filePath) => /\.stories\.tsx?$/.test(filePath)),
    hasTest: files.some((filePath) => /\.test\.tsx?$/.test(filePath) || /\/__tests__\//.test(toPosix(filePath))),
    hasMeta: Boolean(metaPath),
    hasDesignControls: designControlKeys.has(designControlKey),
    meta: {
      apiTable: meta?.dod?.apiTable,
      usagePresent: hasText(meta?.usage),
      designLinkPresent: hasText(meta?.designLink),
      pixsoViewPresent: hasText(meta?.pixsoView)
    }
  }

  const errors = []
  const warnings = []

  if (!facts.hasIndex) errors.push('missing index.ts')
  if (!facts.hasTypesFile) errors.push('missing types.ts or nested equivalent')
  if (!facts.hasPropsExport) errors.push('missing public Props export from index.ts')
  if (!facts.hasStory) errors.push('missing story')
  if (!facts.hasMeta) errors.push('missing meta.json')

  if (!facts.hasTest) warnings.push('missing test')
  if (!facts.hasDesignControls) warnings.push('missing design-controls coverage')
  if (facts.meta.apiTable !== true) warnings.push('apiTable is not true')
  if (!facts.meta.usagePresent) warnings.push('meta.usage is empty')
  if (!facts.meta.designLinkPresent) warnings.push('meta.designLink is empty')
  if (!facts.meta.pixsoViewPresent) warnings.push('meta.pixsoView is empty')

  return { ...facts, errors, warnings }
})

const totals = {
  components: results.length,
  errors: results.reduce((acc, item) => acc + item.errors.length, 0),
  warnings: results.reduce((acc, item) => acc + item.warnings.length, 0),
  componentsWithErrors: results.filter((item) => item.errors.length > 0).length,
  componentsWithWarnings: results.filter((item) => item.warnings.length > 0).length
}

if (asJson) {
  console.log(JSON.stringify({ totals, results }, null, 2))
} else {
  printHumanReport(totals, results)
}

const shouldFail = results.some((item) => item.errors.length > 0) ||
  (strict && results.some((item) => item.warnings.length > 0))

process.exitCode = shouldFail ? 1 : 0

function printHumanReport (totals, results) {
  console.log('Hexa UI component contract audit')
  console.log(`Components: ${totals.components}`)
  console.log(`Components with errors: ${totals.componentsWithErrors}`)
  console.log(`Components with warnings: ${totals.componentsWithWarnings}`)
  console.log(`Error count: ${totals.errors}`)
  console.log(`Warning count: ${totals.warnings}`)

  const problemRows = results.filter((item) => item.errors.length > 0 || item.warnings.length > 0)

  if (!problemRows.length) {
    console.log('No contract gaps detected.')
    return
  }

  console.log('')

  for (const item of problemRows) {
    console.log(`[${item.component}]`)

    for (const error of item.errors) {
      console.log(`  error: ${error}`)
    }

    for (const warning of item.warnings) {
      console.log(`  warn: ${warning}`)
    }
  }
}

function resolveMetaPath (componentDir) {
  const candidates = [
    path.join(componentDir, '__meta__', 'meta.json'),
    path.join(componentDir, 'meta.json'),
    path.join(componentDir, 'stories', 'meta.json')
  ]

  return candidates.find((candidate) => fs.existsSync(candidate))
}

function readJson (filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function safeRead (filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : ''
}

function hasText (value) {
  return typeof value === 'string' && value.trim().length > 0
}

function collectFiles (dirPath) {
  const out = []

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      out.push(...collectFiles(fullPath))
      continue
    }

    out.push(fullPath)
  }

  return out
}

function collectSourceModules (componentDir) {
  return fs.readdirSync(componentDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(ts|tsx)$/.test(entry.name))
    .filter((entry) => entry.name !== 'index.ts')
    .filter((entry) => !/\.stories\.tsx?$/.test(entry.name))
    .filter((entry) => !/\.test\.tsx?$/.test(entry.name))
    .map((entry) => {
      const filePath = path.join(componentDir, entry.name)
      return {
        name: entry.name.replace(/\.(ts|tsx)$/, ''),
        text: safeRead(filePath)
      }
    })
}

function readDesignControlKeys (filePath) {
  const text = safeRead(filePath)
  const matches = text.matchAll(/^\s{2}([A-Za-z0-9_]+):\s*\{/gm)
  return new Set([...matches].map((match) => match[1]))
}

function resolveDesignControlKey (componentName) {
  if (componentName === 'upload') return 'uploader'

  return componentName.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

function toPosix (value) {
  return value.split(path.sep).join('/')
}

function escapeRegExp (value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

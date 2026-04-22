import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.cwd())
const srcIndexPath = path.join(root, 'src/index.ts')
const uxpinComponentsRoot = path.join(root, 'uxpin/components')
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const forceWrappers = args.includes('--force') || args.includes('--force-wrappers')
const forcePresets = args.includes('--force') || args.includes('--force-presets')
const wrappersOnly = args.includes('--wrappers-only')
const presetsOnly = args.includes('--presets-only')

if (wrappersOnly && presetsOnly) {
  throw new Error('Choose either --wrappers-only or --presets-only, not both.')
}

const srcIndex = fs.readFileSync(srcIndexPath, 'utf8')
const exportMatches = [...srcIndex.matchAll(/export (?:\*|\{[^}]+\}) from '\.\/([^']+)'/g)]
const excludedComponents = new Set(['KeyValue', 'Locale', 'Markdown', 'Repeater'])

const componentOverrides = {
  Calendar: {
    generatedName: 'DatePicker',
    importName: 'Calendar',
    propsTypeName: 'CalendarProps',
    propsTypeImportPath: '@src/datepicker/types'
  },
  Input: {
    importName: 'Textbox',
    propsTypeName: 'TextboxProps',
    propsTypeImportPath: '@src/input/types'
  },
  Typography: {
    importName: 'Text',
    propsTypeName: 'TextProps',
    propsTypeImportPath: '@src/typography/text'
  }
}

const componentFilters = parseOptionValues(args, '--component')
const normalizedComponentFilters = new Set(componentFilters.map(normalizeComponentToken))
const folders = exportMatches
  .map((match) => match[1])
  .filter((folder) => !folder.startsWith('@'))

const summary = {
  generatedPresets: [],
  generatedWrappers: [],
  matchedComponents: [],
  missingWrappersForPresets: [],
  preservedPresets: [],
  preservedWrappers: []
}

for (const folder of folders) {
  const folderIndexPath = path.join(root, 'src', folder, 'index.ts')

  if (!fs.existsSync(folderIndexPath)) {
    continue
  }

  const folderIndex = fs.readFileSync(folderIndexPath, 'utf8')
  const componentMatch = folderIndex.match(/export (?:\*|\{[^}]+\}) from '\.\/([^'\/]+)'/)

  if (!componentMatch) {
    continue
  }

  const componentName = componentMatch[1]
  const componentOverride = componentOverrides[componentName]
  const generatedName = componentOverride?.generatedName || componentName
  const componentTokens = [
    folder,
    componentName,
    generatedName,
    toKebabCase(componentName),
    toKebabCase(generatedName)
  ]
  const shouldIncludeComponent = !normalizedComponentFilters.size ||
    componentTokens.some((token) => normalizedComponentFilters.has(normalizeComponentToken(token)))

  if (!/^[A-Za-z_$][\w$]*$/.test(componentName) || !/^[A-Za-z_$][\w$]*$/.test(generatedName)) {
    continue
  }

  if (excludedComponents.has(componentName)) {
    continue
  }

  if (!shouldIncludeComponent) {
    continue
  }

  summary.matchedComponents.push(generatedName)

  const componentDir = path.join(uxpinComponentsRoot, generatedName)
  const componentFilePath = path.join(componentDir, `${generatedName}.tsx`)
  const presetDirPath = path.join(componentDir, 'uxpin-presets')
  const presetFilePath = path.join(presetDirPath, `${generatedName}.jsx`)
  const hexaImportName = componentOverride?.importName || componentName
  const hexaComponentAlias = `Hexa${generatedName}`
  const propsTypeName = `${generatedName}Props`
  const propsTypeImportLine = componentOverride?.propsTypeImportPath
    ? `import { ${componentOverride.propsTypeName} } from '${componentOverride.propsTypeImportPath}'\n\n`
    : ''

  if (!presetsOnly) {
    ensureDir(componentDir)

    if (fs.existsSync(componentFilePath) && !forceWrappers) {
      summary.preservedWrappers.push(`uxpin/components/${generatedName}/${generatedName}.tsx`)
    } else {
      const content = `import React from 'react'\n\nimport { ${hexaImportName} as ${hexaComponentAlias} } from '@src/${folder}'\n${propsTypeImportLine}${componentOverride ? `type ${propsTypeName} = ${componentOverride.propsTypeName}\n\n` : `type ${propsTypeName} = React.ComponentProps<typeof ${hexaComponentAlias}>\n\n`}const ${generatedName} = (props: ${propsTypeName}): JSX.Element => <${hexaComponentAlias} {...props} />\n\nexport default ${generatedName}\n`

      writeFile(componentFilePath, content)
      summary.generatedWrappers.push(`uxpin/components/${generatedName}/${generatedName}.tsx`)
    }
  }

  if (!wrappersOnly) {
    const hasWrapperFile = fs.existsSync(componentFilePath)

    if (presetsOnly && !hasWrapperFile) {
      summary.missingWrappersForPresets.push(`uxpin/components/${generatedName}/${generatedName}.tsx`)
      continue
    }

    ensureDir(presetDirPath)

    if (fs.existsSync(presetFilePath) && !forcePresets) {
      summary.preservedPresets.push(`uxpin/components/${generatedName}/uxpin-presets/${generatedName}.jsx`)
    } else {
      writeFile(presetFilePath, createPresetContent(generatedName))
      summary.generatedPresets.push(`uxpin/components/${generatedName}/uxpin-presets/${generatedName}.jsx`)
    }
  }
}

printSummary(summary)

function createPresetContent (componentName) {
  const presetId = `${toKebabCase(componentName)}-1`

  return `import React from 'react';\n\nimport ${componentName} from '../${componentName}';\n\nexport default (\n  <${componentName}\n    uxpId="${presetId}"\n  />\n);\n`
}

function ensureDir (dirPath) {
  if (dryRun) {
    return
  }

  fs.mkdirSync(dirPath, { recursive: true })
}

function writeFile (filePath, content) {
  if (dryRun) {
    return
  }

  fs.writeFileSync(filePath, content)
}

function parseOptionValues (argv, optionName) {
  const values = []

  argv.forEach((arg, index) => {
    if (arg === optionName) {
      const nextValue = argv[index + 1]

      if (nextValue && !nextValue.startsWith('--')) {
        values.push(nextValue)
      }

      return
    }

    if (arg.startsWith(`${optionName}=`)) {
      values.push(arg.slice(optionName.length + 1))
    }
  })

  return values
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean)
}

function normalizeComponentToken (value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function toKebabCase (value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

function printSection (title, items) {
  if (!items.length) {
    return
  }

  console.log(`${title}: ${items.length}`)

  for (const item of [...items].sort((left, right) => left.localeCompare(right))) {
    console.log(item)
  }

  console.log('')
}

function printSummary (result) {
  if (normalizedComponentFilters.size && !result.matchedComponents.length) {
    console.error(`No components matched filters: ${componentFilters.join(', ')}`)
    process.exitCode = 1
    return
  }

  console.log(`UXPin sync ${dryRun ? '(dry run) ' : ''}summary`)
  printSection('Matched components', result.matchedComponents)

  printSection('Generated wrappers', result.generatedWrappers)
  printSection('Generated presets', result.generatedPresets)
  printSection('Preserved wrappers', result.preservedWrappers)
  printSection('Preserved presets', result.preservedPresets)
  printSection('Skipped preset generation because wrapper is missing', result.missingWrappersForPresets)
}

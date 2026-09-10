import { copyFile, mkdir, readdir, rm } from 'node:fs/promises'
import { basename, dirname, extname, join, parse, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const sourceRoot = fileURLToPath(new URL('../images/', import.meta.url))
const outputRoot = fileURLToPath(new URL('../public/images/', import.meta.url))
const sourceExtensions = new Set(['.png', '.jpg', '.jpeg'])
const portraitNames = new Set(['ivan', 'natasha'])
/* Folders whose files keep their folder in the output path. Everything else
   still flattens, which is what the rest of the site links to. */
const nestedFolders = new Set(['desk'])

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : path
  }))
  return files.flat().sort()
}

await rm(outputRoot, { recursive: true, force: true })
await mkdir(outputRoot, { recursive: true })

const sources = (await walk(sourceRoot)).filter((file) => sourceExtensions.has(extname(file).toLowerCase()))
const outputNames = new Set()

for (const source of sources) {
  const sourceName = basename(source)
  const sourceRelative = relative(sourceRoot, source)

  if (sourceName === 'social-card.png') {
    await copyFile(source, join(outputRoot, 'social-card.png'))
    console.log(`${sourceRelative} -> social-card.png (copied)`)
    continue
  }

  const name = parse(sourceName).name
  const folder = dirname(sourceRelative)
  const nested = nestedFolders.has(folder)
  const outputName = nested ? `${folder}/${name}.webp` : `${name}.webp`
  if (outputNames.has(outputName)) throw new Error(`Duplicate flattened output name: ${outputName}`)
  outputNames.add(outputName)

  if (nested) await mkdir(join(outputRoot, folder), { recursive: true })

  const width = portraitNames.has(name) ? 800 : 1600
  await sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(outputRoot, outputName))

  console.log(`${sourceRelative} -> ${outputName} (max ${width}px)`)
}

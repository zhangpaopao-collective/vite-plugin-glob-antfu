import { dirname } from 'node:path'
import fg from 'fast-glob'
import MagicString from 'magic-string'

const importGlobalNextRE = /\bimport\.meta\.globNext(?:<\w+>)?\((.*)\)/g

export async function transform(code: string, id: string) {
  const matches = Array.from(code.matchAll(importGlobalNextRE))
  if (!matches.length)
    return
  const s = new MagicString(code)
  for (const match of matches) {
    const glob = match[1].slice(1, -1)
    const files = await fg(glob, { dot: true, cwd: dirname(id) })
    const start = match.index!
    const end = start + match[0].length
    const replacement = `{ ${files.reduce((pre, file) => `${pre} '${file}': () => import('${file}'),`, '')} }`
    s.overwrite(start, end, replacement)
  }

  return {
    code: s.toString(),
    map: s.generateMap(),
  }
}

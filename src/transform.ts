import { dirname } from 'node:path'
import fg from 'fast-glob'
import MagicString from 'magic-string'
import { parse } from 'acorn'
import type { ArrayExpression, Literal } from 'estree'

const importGlobalNextRE = /\bimport\.meta\.globNext(?:<\w+>)?\(([\s\S]*?)\)/g

export async function transform(code: string, id: string) {
  const matches = Array.from(code.matchAll(importGlobalNextRE))
  if (!matches.length)
    return
  const s = new MagicString(code)
  for (const match of matches) {
    const args = match[1]
    const ast = parse(args, { ecmaVersion: 'latest' })
    // @ts-expect-error ok let me do it
    const body = ast.body[0].expression as Literal | ArrayExpression
    const globs: string[] = []
    if (body.type === 'ArrayExpression') {
      for (const ele of body.elements) {
        if (ele?.type === 'Literal')
          globs.push(ele.value as string)
      }
    }
    else {
      globs.push(body.value as string)
    }
    const files = await fg(globs, { dot: true, cwd: dirname(id) })
    const start = match.index!
    const end = start + match[0].length
    const replacement = `{${files.map(file => `'${file}': () => import('${file}')`).join(',')}}`
    s.overwrite(start, end, replacement)
  }

  return {
    code: s.toString(),
    map: s.generateMap(),
  }
}

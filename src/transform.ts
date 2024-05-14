import { dirname } from 'node:path'
import fg from 'fast-glob'
import MagicString from 'magic-string'
import { parse } from 'acorn'
import type { ArrayExpression, Literal, ObjectExpression } from 'estree'

const importGlobalNextRE = /\bimport\.meta\.globNext(?:<\w+>)?\(([\s\S]*?)\)/g

export async function transform(code: string, id: string) {
  const matches = Array.from(code.matchAll(importGlobalNextRE))
  if (!matches.length)
    return
  const importPrefix = '__vite_import_glob_next'
  const s = new MagicString(code)

  let matchIndex = 0
  for (const match of matches) {
    const args = `[${match[1]}]`
    // @ts-expect-error ok let me do it
    const ast = parse(args, { ecmaVersion: 'latest' }).body[0].expression as ArrayExpression

    // arg1
    const arg1 = ast.elements[0] as Literal | ArrayExpression
    const globs: string[] = []
    if (arg1.type === 'ArrayExpression') {
      for (const ele of arg1.elements) {
        if (ele?.type === 'Literal')
          globs.push(ele.value as string)
      }
    }
    else {
      globs.push(arg1.value as string)
    }

    // arg2
    const options: GlobOptions<boolean> = {}
    const arg2 = ast.elements[1] as ObjectExpression | undefined
    if (arg2) {
      for (const property of arg2.properties)
      // @ts-expect-error ok let me do it
        options[property.key.name] = property.value.value
    }

    const files = await fg(globs, { dot: true, cwd: dirname(id) })
    const start = match.index!
    const end = start + match[0].length
    const query = options.as ? `?${options.as}` : ''
    if (options.eager) {
      const imports = files.map((file, idx) => `import * as ${importPrefix}_${matchIndex}_${idx}__ from '${file}${query}'`).join('\n')
      s.prepend(`${imports}\n\n`)
      const replacement = `{\n${files.map((file, idx) => `  '${file}': ${importPrefix}_${matchIndex}_${idx}__`).join(',\n')}\n}`
      s.overwrite(start, end, replacement)
    }
    else {
      const replacement = `{\n${files.map(file => `  '${file}': () => import('${file}${query}')`).join(',\n')}\n}`
      s.overwrite(start, end, replacement)
    }

    matchIndex += 1
  }

  return {
    code: s.toString(),
    map: s.generateMap(),
  }
}

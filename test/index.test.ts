import { resolve } from 'node:path'
import { promises as fs } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { transform } from '../src/transform'

describe('should', async () => {
  const id = resolve(__dirname, './fixtures/index.ts')
  const code = await fs.readFile(id, 'utf-8')
  it('transform', async () => {
    expect((await transform(code, id))?.code)
      .toMatchInlineSnapshot(`
        "import * as __vite_import_glob_next_3_0__ from './modules/a.ts'
        import * as __vite_import_glob_next_3_1__ from './modules/b.ts'
        import * as __vite_import_glob_next_3_2__ from './modules/index.ts'

        import * as __vite_import_glob_next_2_0__ from './modules/a.ts?raw'
        import * as __vite_import_glob_next_2_1__ from './modules/b.ts?raw'

        export interface ModuleType {
          name: string
        }

        export const list1 = {
          './modules/a.ts': () => import('./modules/a.ts'),
          './modules/b.ts': () => import('./modules/b.ts'),
          './modules/index.ts': () => import('./modules/index.ts')
        }

        export const list2 = {
          './modules/a.ts': () => import('./modules/a.ts'),
          './modules/b.ts': () => import('./modules/b.ts')
        }

        export const list3 = {
          './modules/a.ts': __vite_import_glob_next_2_0__,
          './modules/b.ts': __vite_import_glob_next_2_1__
        }

        export const list4 = {
          './modules/a.ts': __vite_import_glob_next_3_0__,
          './modules/b.ts': __vite_import_glob_next_3_1__,
          './modules/index.ts': __vite_import_glob_next_3_2__
        }
        "
      `)
  })
})

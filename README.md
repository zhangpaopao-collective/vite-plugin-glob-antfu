# vite-plugin-glob-antfu

```ts
import.meta.globNext('./fixtures/*.ts', { as: 'raw' })

// import.meta.globNext('./fixtures/*.ts', '**/index.ts')

import.meta.globNext([
  './fixtures/*.ts',
  '!**/index.ts',
], {
  as: 'raw',
  eager: true
})

// import.meta.globNext({
//   glob: 'xxx',
//   ignore: 'xxx',
//   as: 'raw',
//   eager: true
// })
```

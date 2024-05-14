/// <reference types="vite/client" />

interface ImportMeta {
  globNext: (<T>(glob: string | string[], options?: GlobOptions<false>) => Record<string, () => Promise<T>>) & (<T>(glob: string | string[], options: GlobOptions<true>) => Record<string, T>)
}

interface GlobOptions<Eager extends boolean> {
  as?: string
  eager?: Eager
}

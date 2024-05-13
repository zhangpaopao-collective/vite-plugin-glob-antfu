import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

interface ModuleType {
  name: string
}

const list = import.meta.globNext<ModuleType>('./fixtures/*.ts')

Promise.all(Object.values(list).map(i => i()))
  .then((modules) => {
    app.textContent = JSON.stringify(modules)
  })
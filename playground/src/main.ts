import './style.css'
import { list } from '../../test/fixtures/index'

const app = document.querySelector<HTMLDivElement>('#app')!

Promise.all(Object.values(list).map(i => i()))
  .then((modules) => {
    app.textContent = JSON.stringify(modules)
  })

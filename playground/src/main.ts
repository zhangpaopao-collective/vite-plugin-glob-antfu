import './style.css'
import { list1, list2 } from '../../test/fixtures/index'

const app = document.querySelector<HTMLDivElement>('#app')!

Promise.all(Object.values(list1).map(i => i()))
  .then((modules) => {
    app.textContent += JSON.stringify(modules)
  })

Promise.all(Object.values(list2).map(i => i()))
  .then((modules) => {
    app.textContent += JSON.stringify(modules)
  })

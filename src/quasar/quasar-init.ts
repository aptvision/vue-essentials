import { createApp } from 'vue'
import { Quasar, Notify, Dialog } from 'quasar'

import 'quasar/dist/quasar.css';
// import '@quasar/extras/material-icons/material-icons.css'

const app = createApp({});
app.use(Quasar, {
  plugins: { Notify, Dialog },
});

const div = document.createElement('div')
document.body.appendChild(div);
app.mount(div)

export { app }
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Error Captured]:', err, info)
  const el = document.getElementById('debug-error-box') || document.createElement('div')
  el.id = 'debug-error-box'
  el.style = 'position:fixed;top:0;left:0;right:0;padding:16px;background:#fee2e2;color:#991b1b;border-bottom:2px solid #ef4444;font-family:monospace;font-size:13px;z-index:999999;box-shadow:0 4px 12px rgba(0,0,0,0.15);white-space:pre-wrap;'
  el.textContent = '❌ [Vue Error] ' + (err?.stack || err?.message || err) + '\nInfo: ' + info
  if (!document.getElementById('debug-error-box')) {
    document.body.prepend(el)
  }
}

app.use(createPinia())
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
}).catch((err) => {
  console.error('[Router isReady Error]:', err)
  app.mount('#app')
})

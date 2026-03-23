import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import IMask from 'imask'

const savedTheme = localStorage.getItem("theme") || "airstyleLight"
document.documentElement.setAttribute("data-theme", savedTheme)

const app = createApp(App)
app.use(router)

// ==========================================
// Directiva personalizada para IMask
// ==========================================
app.directive('mask', {
  mounted(el, binding) {
    const mask = IMask(el, binding.value)
    el._mask = mask
    mask.on('accept', () => {
      el.dispatchEvent(new Event('input')) // actualiza v-model
    })
  },
  unmounted(el) {
    if (el._mask) el._mask.destroy()
  }
})

app.mount('#app')
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.mount('#app')

// dark mode logic (this part is fine)
const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
}

const darkMode = storage.get('darkMode', false)
if (darkMode) {
  document.documentElement.classList.add('dark')
}



// import './assets/main.css'
// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'

// createApp(App).mount('#app')

/**
 * import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).mount('#app')

import Vue from "vue"
import VueRouter from "vue-router"

const { createRouter, createWebHashHistory } = VueRouter

import Dashboard from "./pages/Dashboard.vue"
import Expenses from "./pages/Expenses.vue"
import Analytics from "./pages/Analytics.vue"
import Settings from "./pages/Settings.vue"

const routes = [
  { path: "/", component: Dashboard },
  { path: "/expenses", component: Expenses },
  { path: "/analytics", component: Analytics },
  { path: "/settings", component: Settings },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount("#app")

const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      return defaultValue
    }
  },
}

const darkMode = storage.get("darkMode", false)
if (darkMode) {
  document.documentElement.classList.add("dark")
}

 */
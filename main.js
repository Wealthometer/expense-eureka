import Vue from "vue"
import VueRouter from "vue-router"

const { createApp } = Vue
const { createRouter, createWebHashHistory } = VueRouter

// Import components
import App from "./src/App.vue"
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

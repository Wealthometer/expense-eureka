// import { createRouter, createWebHistory } from 'vue-router'

// import AppLayout from '@/components/AppLayout.vue'
// import Dashboard from '@/pages/Dashboard.vue'
// import Analytics from '@/pages/Analytics.vue'
// import Expenses from '@/pages/Expenses.vue'
// import Settings from '@/pages/Settings.vue'

// const routes = [
//   {
//     path: '/',
//     component: AppLayout,
//     children: [
//       { path: '', name: 'dashboard', component: Dashboard },
//       { path: 'analytics', name: 'analytics', component: Analytics },
//       { path: 'expenses', name: 'expenses', component: Expenses },
//       { path: 'settings', name: 'settings', component: Settings },
//     ],
//   },
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// })

// export default router


import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/pages/Dashboard.vue'
import Expenses from '@/pages/Expenses.vue'
import Analytics from '@/pages/Analytics.vue'
import Settings from '@/pages/Settings.vue'
import AppLayout from '@/components/AppLayout.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', component: Dashboard },
      { path: 'expenses', component: Expenses },
      { path: 'analytics', component: Analytics },
      { path: 'settings', component: Settings },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

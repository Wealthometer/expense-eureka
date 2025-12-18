<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen transition-colors duration-200">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400">💰 Expense Tracker</h1>
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              :title="isDarkMode ? 'Light Mode' : 'Dark Mode'"
            >
              <component :is="isDarkMode ? Sun : Moon" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">${{ totalExpenses.toFixed(2) }}</p>
              </div>
              <TrendingDown class="w-10 h-10 text-red-500 opacity-50" />
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">${{ currentMonthTotal.toFixed(2) }}</p>
              </div>
              <Calendar class="w-10 h-10 text-orange-500 opacity-50" />
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ expenses.length }}</p>
              </div>
              <Receipt class="w-10 h-10 text-blue-500 opacity-50" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Add Expense Form -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus class="w-5 h-5" />
              Add New Expense
            </h2>
            <form @submit.prevent="addExpense" class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Amount ($)</label>
                <input
                  v-model.number="newExpense.amount"
                  type="number"
                  step="0.01"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Category</label>
                <select
                  v-model="newExpense.category"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" disabled>Select a category</option>
                  <option v-for="cat in categories" :key="cat.name" :value="cat.name">
                    {{ cat.icon }} {{ cat.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Description</label>
                <input
                  v-model="newExpense.description"
                  type="text"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What did you spend on?"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Date</label>
                <input
                  v-model="newExpense.date"
                  type="date"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus class="w-5 h-5" />
                Add Expense
              </button>
            </form>
          </div>

          <!-- Chart -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
              <PieChart class="w-5 h-5" />
              Expenses by Category
            </h2>
            <canvas ref="chartCanvas" class="w-full"></canvas>
          </div>
        </div>

        <!-- Monthly Summary -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 class="w-5 h-5" />
            Monthly Summary
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="text-left py-3 px-4">Month</th>
                  <th class="text-right py-3 px-4">Total</th>
                  <th class="text-right py-3 px-4">Transactions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(summary, month) in monthlySummaries"
                  :key="month"
                  class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td class="py-3 px-4 font-medium">{{ month }}</td>
                  <td class="py-3 px-4 text-right text-red-600 dark:text-red-400 font-semibold">
                    ${{ summary.total.toFixed(2) }}
                  </td>
                  <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                    {{ summary.count }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Expenses -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <Receipt class="w-5 h-5" />
            Recent Expenses
          </h2>
          <div v-if="expenses.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <Wallet class="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No expenses yet. Add your first expense above!</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="expense in sortedExpenses"
              :key="expense.id"
              class="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex items-center gap-4 flex-1">
                <div class="text-2xl">{{ getCategoryIcon(expense.category) }}</div>
                <div class="flex-1">
                  <p class="font-medium">{{ expense.description }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ expense.category }} • {{ formatDate(expense.date) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-lg font-semibold text-red-600 dark:text-red-400">
                  ${{ expense.amount.toFixed(2) }}
                </span>
                <button
                  @click="deleteExpense(expense.id)"
                  class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Moon, Sun, Plus, Trash2, TrendingDown, Calendar, Receipt, PieChart, BarChart3, Wallet } from 'lucide-vue-next'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// Dark mode
const isDarkMode = ref(false)

// Categories
const categories = [
  { name: 'Food', icon: '🍔', color: '#ef4444' },
  { name: 'Transport', icon: '🚗', color: '#3b82f6' },
  { name: 'Shopping', icon: '🛍️', color: '#8b5cf6' },
  { name: 'Entertainment', icon: '🎬', color: '#ec4899' },
  { name: 'Bills', icon: '💡', color: '#f59e0b' },
  { name: 'Health', icon: '🏥', color: '#10b981' },
  { name: 'Other', icon: '📝', color: '#6b7280' }
]

// Expenses
const expenses = ref([])

// New expense form
const newExpense = ref({
  amount: '',
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0]
})

// Chart
const chartCanvas = ref(null)
let chartInstance = null

// Computed
const totalExpenses = computed(() => {
  return expenses.value.reduce((sum, exp) => sum + exp.amount, 0)
})

const currentMonthTotal = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  return expenses.value
    .filter(exp => {
      const expDate = new Date(exp.date)
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
    })
    .reduce((sum, exp) => sum + exp.amount, 0)
})

const sortedExpenses = computed(() => {
  return [...expenses.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const monthlySummaries = computed(() => {
  const summaries = {}
  
  expenses.value.forEach(exp => {
    const date = new Date(exp.date)
    const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    
    if (!summaries[monthKey]) {
      summaries[monthKey] = { total: 0, count: 0 }
    }
    
    summaries[monthKey].total += exp.amount
    summaries[monthKey].count += 1
  })
  
  return summaries
})

const categoryTotals = computed(() => {
  const totals = {}
  
  expenses.value.forEach(exp => {
    if (!totals[exp.category]) {
      totals[exp.category] = 0
    }
    totals[exp.category] += exp.amount
  })
  
  return totals
})

// Methods
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value)
  updateChart()
}

const addExpense = () => {
  const expense = {
    id: Date.now(),
    amount: newExpense.value.amount,
    category: newExpense.value.category,
    description: newExpense.value.description,
    date: newExpense.value.date
  }
  
  expenses.value.push(expense)
  
  // Reset form
  newExpense.value = {
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  }
  
  saveExpenses()
}

const deleteExpense = (id) => {
  expenses.value = expenses.value.filter(exp => exp.id !== id)
  saveExpenses()
}

const getCategoryIcon = (categoryName) => {
  const category = categories.find(cat => cat.name === categoryName)
  return category ? category.icon : '📝'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const saveExpenses = () => {
  localStorage.setItem('expenses', JSON.stringify(expenses.value))
}

const loadExpenses = () => {
  const saved = localStorage.getItem('expenses')
  if (saved) {
    expenses.value = JSON.parse(saved)
  }
}

const loadDarkMode = () => {
  const saved = localStorage.getItem('darkMode')
  if (saved !== null) {
    isDarkMode.value = saved === 'true'
  }
}

const updateChart = () => {
  if (!chartCanvas.value) return
  
  const ctx = chartCanvas.value.getContext('2d')
  
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  const labels = Object.keys(categoryTotals.value)
  const data = Object.values(categoryTotals.value)
  const colors = labels.map(label => {
    const category = categories.find(cat => cat.name === label)
    return category ? category.color : '#6b7280'
  })
  
  const textColor = isDarkMode.value ? '#e5e7eb' : '#1f2937'
  const gridColor = isDarkMode.value ? '#374151' : '#e5e7eb'
  
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: isDarkMode.value ? '#1f2937' : '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed || 0
              return `${label}: $${value.toFixed(2)}`
            }
          }
        }
      }
    }
  })
}

// Watchers
watch(expenses, () => {
  nextTick(() => {
    updateChart()
  })
}, { deep: true })

watch(isDarkMode, () => {
  nextTick(() => {
    updateChart()
  })
})

// Lifecycle
onMounted(() => {
  loadDarkMode()
  loadExpenses()
  nextTick(() => {
    updateChart()
  })
})
</script>

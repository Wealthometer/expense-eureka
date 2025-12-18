<template>
  <div class="p-4 lg:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Overview of your expenses</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total Expenses -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold">{{ formatCurrency(totalExpenses) }}</p>
      </div>

      <!-- This Month -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
          <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold">{{ formatCurrency(currentMonthExpenses) }}</p>
      </div>

      <!-- Transaction Count -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Transactions</p>
          <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold">{{ expenseCount }}</p>
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Expenses -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold">Recent Expenses</h2>
        </div>
        <div class="p-6">
          <div v-if="recentExpenses.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No expenses yet. Start by adding your first expense!
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="expense in recentExpenses" 
              :key="expense.id"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div 
                  class="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  :style="{ backgroundColor: getCategoryById(expense.category).color + '20' }"
                >
                  {{ getCategoryById(expense.category).icon }}
                </div>
                <div>
                  <p class="font-medium">{{ expense.description || getCategoryById(expense.category).name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(expense.date) }}</p>
                </div>
              </div>
              <p class="font-semibold text-red-600 dark:text-red-400">-{{ formatCurrency(expense.amount) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Categories -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold">Top Categories</h2>
        </div>
        <div class="p-6">
          <div v-if="categoryBreakdown.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No category data available yet.
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="item in categoryBreakdown" 
              :key="item.category.id"
              class="flex items-center gap-4"
            >
              <div 
                class="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                :style="{ backgroundColor: item.category.color + '20' }"
              >
                {{ item.category.icon }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="font-medium">{{ item.category.name }}</p>
                  <p class="font-semibold">{{ formatCurrency(item.amount) }}</p>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full"
                    :style="{ 
                      width: ((item.amount / totalExpenses) * 100) + '%',
                      backgroundColor: item.category.color 
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Add Button -->
    <router-link 
      to="/expenses"
      class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </router-link>
  </div>
</template>

<script>
import { storage } from "../utils/storage.js"
import { getCategoryById } from "../utils/categories.js"

export default {
  name: "Dashboard",
  data() {
    return {
      expenses: [],
    }
  },
  computed: {
    totalExpenses() {
      return this.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    },
    currentMonthExpenses() {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      return this.expenses
        .filter((expense) => {
          const date = new Date(expense.date)
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear
        })
        .reduce((sum, expense) => sum + expense.amount, 0)
    },
    expenseCount() {
      return this.expenses.length
    },
    recentExpenses() {
      return [...this.expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
    },
    categoryBreakdown() {
      const breakdown = {}
      this.expenses.forEach((expense) => {
        if (!breakdown[expense.category]) {
          breakdown[expense.category] = 0
        }
        breakdown[expense.category] += expense.amount
      })
      return Object.entries(breakdown)
        .map(([category, amount]) => ({
          category: getCategoryById(category),
          amount,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3)
    },
  },
  mounted() {
    this.loadExpenses()
  },
  methods: {
    loadExpenses() {
      this.expenses = storage.get("expenses", [])
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    },
    getCategoryById,
  },
}
</script>

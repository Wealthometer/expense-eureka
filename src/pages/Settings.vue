<template>
  <div class="p-4 lg:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Settings</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage your preferences</p>
    </div>

    <!-- Settings Sections -->
    <div class="space-y-6">
      <!-- Appearance -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold mb-4">Appearance</h2>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Dark Mode</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Toggle dark mode theme</p>
          </div>
          <button
            @click="toggleDarkMode"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              darkMode ? 'bg-blue-600' : 'bg-gray-300',
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                darkMode ? 'translate-x-6' : 'translate-x-1',
              ]"
            ></span>
          </button>
        </div>
      </div>

      <!-- Data Management -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold mb-4">Data Management</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Export Data</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Download all your expenses as JSON</p>
            </div>
            <button
              @click="exportData"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Export
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Import Data</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Restore expenses from a backup file</p>
            </div>
            <label class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors cursor-pointer">
              Import
              <input type="file" @change="importData" accept=".json" class="hidden" />
            </label>
          </div>

          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-red-600 dark:text-red-400">Clear All Data</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Permanently delete all expenses</p>
              </div>
              <button
                @click="clearAllData"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold mb-4">Statistics</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
            <p class="text-2xl font-bold">{{ expenseCount }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Categories Used</p>
            <p class="text-2xl font-bold">{{ categoriesUsed }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">This Month</p>
            <p class="text-2xl font-bold">{{ monthlyCount }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Avg per Day</p>
            <p class="text-2xl font-bold">{{ formatCurrency(avgPerDay) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage } from "../utils/storage.js"

export default {
  name: "Settings",
  data() {
    return {
      darkMode: false,
      expenses: [],
    }
  },
  computed: {
    expenseCount() {
      return this.expenses.length
    },
    categoriesUsed() {
      const categories = new Set(this.expenses.map((e) => e.category))
      return categories.size
    },
    monthlyCount() {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      return this.expenses.filter((expense) => {
        const date = new Date(expense.date)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
      }).length
    },
    avgPerDay() {
      if (this.expenses.length === 0) return 0

      const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0)
      const oldestDate = new Date(Math.min(...this.expenses.map((e) => new Date(e.date))))
      const daysDiff = Math.max(1, Math.ceil((Date.now() - oldestDate) / (1000 * 60 * 60 * 24)))

      return total / daysDiff
    },
  },
  mounted() {
    this.loadSettings()
    this.loadExpenses()
  },
  methods: {
    loadSettings() {
      this.darkMode = storage.get("darkMode", false)
    },
    loadExpenses() {
      this.expenses = storage.get("expenses", [])
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      storage.set("darkMode", this.darkMode)

      if (this.darkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    },
    exportData() {
      const data = {
        expenses: this.expenses,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `expense-tracker-backup-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    },
    importData(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.expenses && Array.isArray(data.expenses)) {
            if (confirm(`Import ${data.expenses.length} expenses? This will merge with existing data.`)) {
              const existingIds = new Set(this.expenses.map((e) => e.id))
              const newExpenses = data.expenses.filter((e) => !existingIds.has(e.id))

              this.expenses = [...this.expenses, ...newExpenses]
              storage.set("expenses", this.expenses)

              alert(`Successfully imported ${newExpenses.length} new expenses!`)
              this.loadExpenses()
            }
          } else {
            alert("Invalid backup file format")
          }
        } catch (error) {
          alert("Error reading backup file")
        }
      }
      reader.readAsText(file)

      event.target.value = ""
    },
    clearAllData() {
      if (
        confirm(
          "Are you sure you want to delete all expenses? This action cannot be undone. Consider exporting your data first."
        )
      ) {
        if (confirm("Final confirmation: Delete all expenses permanently?")) {
          storage.set("expenses", [])
          this.expenses = []
          alert("All data has been cleared")
        }
      }
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    },
  },
}
</script>

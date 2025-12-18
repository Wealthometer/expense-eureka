<template>
  <div class="p-4 lg:p-8">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold mb-2">Expenses</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your expenses</p>
      </div>
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Expense
      </button>
    </div>

    <!-- Filters -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium mb-2">Filter by Category</label>
        <select
          v-model="filterCategory"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.icon }} {{ category.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Sort By</label>
        <select
          v-model="sortBy"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="amount-desc">Amount (High to Low)</option>
          <option value="amount-asc">Amount (Low to High)</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Search</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search expenses..."
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        />
      </div>
    </div>

    <!-- Expenses List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div v-if="filteredExpenses.length === 0" class="p-12 text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 mb-4">No expenses found</p>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Add Your First Expense
        </button>
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="expense in filteredExpenses"
          :key="expense.id"
          class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
              :style="{ backgroundColor: getCategoryById(expense.category).color + '20' }"
            >
              {{ getCategoryById(expense.category).icon }}
            </div>
            <div>
              <p class="font-medium">{{ expense.description || getCategoryById(expense.category).name }}</p>
              <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{{ getCategoryById(expense.category).name }}</span>
                <span>•</span>
                <span>{{ formatDate(expense.date) }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <p class="text-xl font-bold text-red-600 dark:text-red-400">
              {{ formatCurrency(expense.amount) }}
            </p>
            <div class="flex gap-2">
              <button
                @click="openEditModal(expense)"
                class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="deleteExpense(expense.id)"
                class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-6">{{ editingExpense ? 'Edit' : 'Add' }} Expense</h2>
        
        <form @submit.prevent="saveExpense" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Amount</label>
            <input
              v-model.number="form.amount"
              type="number"
              step="0.01"
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              placeholder="0.00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Category</label>
            <select
              v-model="form.category"
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <option value="" disabled>Select a category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.icon }} {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Description</label>
            <input
              v-model="form.description"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Date</label>
            <input
              v-model="form.date"
              type="date"
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {{ editingExpense ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { storage } from "../utils/storage.js"
import { categories, getCategoryById } from "../utils/categories.js"

export default {
  name: "Expenses",
  data() {
    return {
      expenses: [],
      categories,
      showModal: false,
      editingExpense: null,
      form: {
        amount: null,
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      },
      filterCategory: "",
      sortBy: "date-desc",
      searchQuery: "",
    }
  },
  computed: {
    filteredExpenses() {
      let filtered = [...this.expenses]

      // Filter by category
      if (this.filterCategory) {
        filtered = filtered.filter((e) => e.category === this.filterCategory)
      }

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (e) =>
            e.description?.toLowerCase().includes(query) ||
            getCategoryById(e.category).name.toLowerCase().includes(query)
        )
      }

      // Sort
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case "date-desc":
            return new Date(b.date) - new Date(a.date)
          case "date-asc":
            return new Date(a.date) - new Date(b.date)
          case "amount-desc":
            return b.amount - a.amount
          case "amount-asc":
            return a.amount - b.amount
          default:
            return 0
        }
      })

      return filtered
    },
  },
  mounted() {
    this.loadExpenses()
  },
  methods: {
    loadExpenses() {
      this.expenses = storage.get("expenses", [])
    },
    openAddModal() {
      this.editingExpense = null
      this.form = {
        amount: null,
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      }
      this.showModal = true
    },
    openEditModal(expense) {
      this.editingExpense = expense
      this.form = {
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.editingExpense = null
    },
    saveExpense() {
      if (this.editingExpense) {
        // Update existing expense
        const index = this.expenses.findIndex((e) => e.id === this.editingExpense.id)
        this.expenses[index] = {
          ...this.editingExpense,
          ...this.form,
        }
      } else {
        // Add new expense
        this.expenses.push({
          id: Date.now().toString(),
          ...this.form,
        })
      }

      storage.set("expenses", this.expenses)
      this.closeModal()
    },
    deleteExpense(id) {
      if (confirm("Are you sure you want to delete this expense?")) {
        this.expenses = this.expenses.filter((e) => e.id !== id)
        storage.set("expenses", this.expenses)
      }
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

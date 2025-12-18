import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
import { Chart } from "@/components/ui/chart"
<template>
  <div class="p-4 lg:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Analytics</h1>
      <p class="text-gray-600 dark:text-gray-400">Visualize your spending patterns</p>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Category Distribution -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold mb-4">Expenses by Category</h2>
        <div class="flex items-center justify-center" style="height: 300px">
          <canvas ref="categoryChart"></canvas>
        </div>
      </div>

      <!-- Monthly Trend -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold mb-4">Monthly Spending Trend</h2>
        <div class="flex items-center justify-center" style="height: 300px">
          <canvas ref="monthlyChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Detailed Breakdown -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold">Category Breakdown</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Transactions
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in categoryStats" :key="item.category.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    :style="{ backgroundColor: item.category.color + '20' }"
                  >
                    {{ item.category.icon }}
                  </div>
                  <span class="font-medium">{{ item.category.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap font-semibold">
                {{ formatCurrency(item.total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ item.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="flex-1 max-w-[100px] bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      class="h-2 rounded-full"
                      :style="{
                        width: item.percentage + '%',
                        backgroundColor: item.category.color,
                      }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium">{{ item.percentage.toFixed(1) }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { storage } from "../utils/storage.js"
import { getCategoryById, categories } from "../utils/categories.js"

export default {
  name: "Analytics",
  data() {
    return {
      expenses: [],
      categoryChart: null,
      monthlyChart: null,
    }
  },
  computed: {
    totalExpenses() {
      return this.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    },
    categoryData() {
      const breakdown = {}
      this.expenses.forEach((expense) => {
        if (!breakdown[expense.category]) {
          breakdown[expense.category] = { total: 0, count: 0 }
        }
        breakdown[expense.category].total += expense.amount
        breakdown[expense.category].count += 1
      })
      return breakdown
    },
    categoryStats() {
      return Object.entries(this.categoryData)
        .map(([categoryId, data]) => ({
          category: getCategoryById(categoryId),
          total: data.total,
          count: data.count,
          percentage: (data.total / this.totalExpenses) * 100,
        }))
        .sort((a, b) => b.total - a.total)
    },
    monthlyData() {
      const monthly = {}
      this.expenses.forEach((expense) => {
        const date = new Date(expense.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        if (!monthly[monthKey]) {
          monthly[monthKey] = 0
        }
        monthly[monthKey] += expense.amount
      })

      const sorted = Object.entries(monthly).sort((a, b) => a[0].localeCompare(b[0]))
      return {
        labels: sorted.map(([month]) => {
          const [year, m] = month.split("-")
          const date = new Date(year, parseInt(m) - 1)
          return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
        }),
        data: sorted.map(([, amount]) => amount),
      }
    },
  },
  mounted() {
    this.loadExpenses()
    this.$nextTick(() => {
      this.renderCharts()
    })
  },
  methods: {
    loadExpenses() {
      this.expenses = storage.get("expenses", [])
    },
    renderCharts() {
      this.renderCategoryChart()
      this.renderMonthlyChart()
    },
    renderCategoryChart() {
      const ctx = this.$refs.categoryChart
      if (!ctx) return

      if (this.categoryChart) {
        this.categoryChart.destroy()
      }

      const stats = this.categoryStats
      this.categoryChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: stats.map((s) => s.category.name),
          datasets: [
            {
              data: stats.map((s) => s.total),
              backgroundColor: stats.map((s) => s.category.color),
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: document.documentElement.classList.contains("dark") ? "#9ca3af" : "#4b5563",
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || ""
                  const value = this.formatCurrency(context.parsed)
                  return `${label}: ${value}`
                },
              },
            },
          },
        },
      })
    },
    renderMonthlyChart() {
      const ctx = this.$refs.monthlyChart
      if (!ctx) return

      if (this.monthlyChart) {
        this.monthlyChart.destroy()
      }

      const monthly = this.monthlyData
      this.monthlyChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: monthly.labels,
          datasets: [
            {
              label: "Monthly Expenses",
              data: monthly.data,
              backgroundColor: "#3b82f6",
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `Expenses: ${this.formatCurrency(context.parsed.y)}`
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: document.documentElement.classList.contains("dark") ? "#9ca3af" : "#4b5563",
                callback: (value) => {
                  return "$" + value.toLocaleString()
                },
              },
              grid: {
                color: document.documentElement.classList.contains("dark") ? "#374151" : "#e5e7eb",
              },
            },
            x: {
              ticks: {
                color: document.documentElement.classList.contains("dark") ? "#9ca3af" : "#4b5563",
              },
              grid: {
                display: false,
              },
            },
          },
        },
      })
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    },
  },
  beforeUnmount() {
    if (this.categoryChart) {
      this.categoryChart.destroy()
    }
    if (this.monthlyChart) {
      this.monthlyChart.destroy()
    }
  },
}
</script>

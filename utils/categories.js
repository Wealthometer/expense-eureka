export const categories = [
  { id: "food", name: "Food", icon: "🍔", color: "#ef4444" },
  { id: "transport", name: "Transport", icon: "🚗", color: "#3b82f6" },
  { id: "shopping", name: "Shopping", icon: "🛍️", color: "#8b5cf6" },
  { id: "entertainment", name: "Entertainment", icon: "🎮", color: "#ec4899" },
  { id: "bills", name: "Bills", icon: "📄", color: "#f59e0b" },
  { id: "health", name: "Health", icon: "🏥", color: "#10b981" },
  { id: "other", name: "Other", icon: "📦", color: "#6b7280" },
]

export function getCategoryById(id) {
  return categories.find((cat) => cat.id === id) || categories[categories.length - 1]
}

<template>
  <div class="min-h-screen flex">
    <Sidebar />
    <main class="flex-1 lg:ml-64">
      <slot></slot>
    </main>
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue"

export default {
  name: "AppLayout",
  components: {
    Sidebar,
  },
}
</script>

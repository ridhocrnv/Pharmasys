<script setup>
import Sidebar from '../components/Sidebar.vue';
</script>

<template>
  <div class="flex min-h-screen bg-[#0f172a] text-slate-200">
    <Sidebar />

    <main class="flex-1 p-8 h-screen overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>
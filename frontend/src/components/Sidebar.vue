<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const role = localStorage.getItem('role');
const username = localStorage.getItem('username');

const handleLogout = () => {
  localStorage.clear();
  router.push('/login');
};

// Logika Menu Berdasarkan Role
const menu = {
  isAdmin: role === 'Admin',
  isGudang: role === 'Petugas Gudang' || role === 'Admin',
  isApoteker: role === 'Apoteker' || role === 'Admin'
};
</script>

<template>
  <aside class="w-64 bg-gray-800 h-screen flex flex-col border-r border-gray-700">
    <div class="p-6">
      <h1 class="text-white text-xl font-bold">E-Apotek</h1>
      <p class="text-gray-400 text-xs mt-1">User: {{ username }} ({{ role }})</p>
    </div>

    <nav class="flex-1 px-4 space-y-2">
      <router-link to="/dashboard" class="block py-2.5 px-4 rounded transition duration-200 text-gray-300 hover:bg-gray-700 hover:text-white">
        Dashboard
      </router-link>

      <div v-if="menu.isAdmin">
        <p class="text-gray-500 text-[10px] uppercase font-bold px-4 mt-4 mb-2">Master Data</p>
        <router-link to="/medicines" class="block py-2.5 px-4 rounded text-gray-300 hover:bg-gray-700 hover:text-white italic">
          Kelola Obat
        </router-link>
        <router-link to="/suppliers" class="block py-2.5 px-4 rounded text-gray-300 hover:bg-gray-700 hover:text-white italic">
          Kelola Supplier
        </router-link>
      </div>

      <div v-if="menu.isGudang">
        <p class="text-gray-500 text-[10px] uppercase font-bold px-4 mt-4 mb-2">Logistik</p>
        <router-link to="/transactions" class="block py-2.5 px-4 rounded text-gray-300 hover:bg-gray-700 hover:text-white italic">
          Obat Masuk/Keluar
        </router-link>
      </div>

      <div v-if="menu.isApoteker">
        <p class="text-gray-500 text-[10px] uppercase font-bold px-4 mt-4 mb-2">Laporan</p>
        <router-link to="/reports" class="block py-2.5 px-4 rounded text-gray-300 hover:bg-gray-700 hover:text-white italic">
          Laporan Stok
        </router-link>
      </div>
    </nav>

    <div class="p-4 border-t border-gray-700">
      <button @click="handleLogout" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition">
        Logout
      </button>
    </div>
  </aside>
</template>
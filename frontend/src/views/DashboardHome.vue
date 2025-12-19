<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';

const stats = ref({ totalObat: 0, stokKritis: 0, totalSupplier: 0 });

onMounted(async () => {
  try {
    const [resMed, resSup] = await Promise.all([
      api.get('/medicines'),
      api.get('/suppliers')
    ]);
    stats.value.totalObat = resMed.data.length;
    stats.value.totalSupplier = resSup.data.length;
    stats.value.stokKritis = resMed.data.filter(item => item.stok < 10).length;
  } catch (err) { console.error(err); }
});
</script>

<template>
  <div class="space-y-8">
    <header>
      <h2 class="text-4xl font-black text-white">Halo, Selamat Datang! 👋</h2>
      <p class="text-slate-400 mt-2">Berikut adalah ringkasan inventori farmasi hari ini.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl flex items-center justify-between">
        <div>
          <p class="text-slate-500 text-xs font-black uppercase tracking-widest">Total Obat</p>
          <h3 class="text-4xl font-black text-white mt-1">{{ stats.totalObat }}</h3>
        </div>
        <i class="fas fa-pills text-4xl text-emerald-500 opacity-20"></i>
      </div>

      <div class="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl flex items-center justify-between">
        <div>
          <p class="text-slate-500 text-xs font-black uppercase tracking-widest">Stok Kritis</p>
          <h3 class="text-4xl font-black text-red-500 mt-1">{{ stats.stokKritis }}</h3>
        </div>
        <i class="fas fa-exclamation-triangle text-4xl text-red-500 opacity-20"></i>
      </div>

      <div class="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl flex items-center justify-between">
        <div>
          <p class="text-slate-500 text-xs font-black uppercase tracking-widest">Mitra Supplier</p>
          <h3 class="text-4xl font-black text-white mt-1">{{ stats.totalSupplier }}</h3>
        </div>
        <i class="fas fa-truck-medical text-4xl text-blue-500 opacity-20"></i>
      </div>
    </div>
  </div>
</template>
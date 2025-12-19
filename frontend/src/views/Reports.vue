<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../api/axios';
import Swal from 'sweetalert2';

const inventory = ref([]);
const searchQuery = ref('');
const filterStatus = ref('Semua');

const fetchReports = async () => {
  try {
    const res = await api.get('/reports/inventory');
    inventory.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const filteredInventory = computed(() => {
  return inventory.value.filter(item => {
    const matchSearch = item.nama_obat.toLowerCase().includes(searchQuery.value.toLowerCase());
    if (filterStatus.value === 'Kritis') return matchSearch && item.stok < 10;
    if (filterStatus.value === 'Tersedia') return matchSearch && item.stok >= 10;
    return matchSearch;
  });
});

const exportCSV = () => {
  Swal.fire({
    title: 'Ekspor Data?',
    text: "Laporan akan diunduh dalam format CSV",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    confirmButtonText: 'Ya, Unduh',
    background: '#1e293b',
    color: '#fff'
  }).then((result) => {
    if (result.isConfirmed) {
      const headers = ['Nama Obat', 'Stok', 'Satuan', 'Lokasi', 'Supplier'];
      const rows = filteredInventory.value.map(i => [i.nama_obat, i.stok, i.satuan, i.nama_rak, i.nama_supplier]);
      let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Laporan_Stok_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      
      Swal.fire({ title: 'Berhasil!', text: 'Laporan siap dibuka di Excel', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  });
};

onMounted(fetchReports);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-3xl font-black text-white">
          <i class="fas fa-file-medical text-emerald-500 mr-2"></i> Laporan Inventori
        </h2>
        <p class="text-slate-400 text-sm italic">Monitoring ketersediaan obat secara real-time.</p>
      </div>
      <button @click="exportCSV" class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all">
        <i class="fas fa-file-export"></i> <span>Ekspor Laporan</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-700">
      <div class="relative">
        <i class="fas fa-search absolute left-4 top-3.5 text-slate-500"></i>
        <input v-model="searchQuery" type="text" placeholder="Cari nama obat..." 
          class="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-white outline-none focus:border-emerald-500">
      </div>
      <select v-model="filterStatus" class="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-500">
        <option value="Semua">Semua Status Stok</option>
        <option value="Kritis">Stok Kritis ( < 10 )</option>
        <option value="Tersedia">Stok Aman</option>
      </select>
    </div>

    <div class="bg-slate-800/50 border border-slate-700 rounded-3xl overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-700/30 text-slate-400 text-xs uppercase font-black tracking-widest">
          <tr>
            <th class="p-5">Nama Obat</th>
            <th class="p-5 text-center">Stok</th>
            <th class="p-5">Lokasi Rak</th>
            <th class="p-5">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/50">
          <tr v-for="item in filteredInventory" :key="item.nama_obat" class="hover:bg-slate-700/20 transition-colors">
            <td class="p-5">
              <div class="font-bold text-white">{{ item.nama_obat }}</div>
              <div class="text-xs text-slate-500">{{ item.nama_supplier }}</div>
            </td>
            <td class="p-5 text-center font-mono font-bold">{{ item.stok }} {{ item.satuan }}</td>
            <td class="p-5"><i class="fas fa-layer-group text-slate-600 mr-2"></i>{{ item.nama_rak }}</td>
            <td class="p-5">
              <span v-if="item.stok < 10" class="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black border border-red-500/20">
                LOW STOCK
              </span>
              <span v-else class="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-500/20">
                AVAILABLE
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
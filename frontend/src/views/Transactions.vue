<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';
import Swal from 'sweetalert2';

// State Management
const medicines = ref([]);
const transactions = ref([]);
const loading = ref(false);

const form = ref({
  id_obat: '',
  tipe_transaksi: 'Masuk',
  jumlah: 1
});

// Fungsi untuk mengambil data terbaru (Obat & Riwayat)
const fetchData = async () => {
  try {
    const [resMed, resHistory] = await Promise.all([
      api.get('/medicines'),
      api.get('/reports/history')
    ]);
    // Mengisi data obat untuk dropdown stok terbaru [cite: 316-317]
    medicines.value = resMed.data;
    // Mengisi riwayat transaksi terakhir [cite: 343]
    transactions.value = resHistory.data;
  } catch (err) {
    console.error("Gagal sinkronisasi data:", err.response?.data);
  }
};

const submitTransaksi = async () => {
  // Validasi Dasar Frontend
  if (!form.value.id_obat) {
    return Swal.fire({ icon: 'warning', title: 'Pilih Obat!', text: 'Silakan pilih obat terlebih dahulu.', background: '#1e293b', color: '#fff' });
  }

  // Cek validasi stok jika tipe transaksi adalah "Keluar" [cite: 129]
  if (form.value.tipe_transaksi === 'Keluar') {
    const selectedMed = medicines.value.find(m => m.id === form.value.id_obat);
    if (selectedMed && form.value.jumlah > selectedMed.stok) {
      return Swal.fire({ 
        icon: 'error', 
        title: 'Stok Kurang!', 
        text: `Stok tersedia hanya ${selectedMed.stok}`,
        background: '#1e293b', 
        color: '#fff' 
      });
    }
  }

  loading.value = true;
  try {
    // Kirim data ke backend [cite: 207-208]
    await api.post('/transactions', form.value);
    
    // Notifikasi Sukses
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: `Transaksi ${form.value.tipe_transaksi} berhasil dicatat.`,
      timer: 1500,
      showConfirmButton: false,
      background: '#1e293b',
      color: '#fff',
      iconColor: '#10b981'
    });

    // RESET FORM
    form.value = { id_obat: '', tipe_transaksi: 'Masuk', jumlah: 1 };
    
    // REFRESH DATA OTOMATIS (Sync stok dan riwayat di UI) 
    await fetchData(); 
    
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Simpan',
      text: err.response?.data?.message || 'Terjadi kesalahan sistem',
      background: '#1e293b',
      color: '#fff'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="space-y-6">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-white">
        <i class="fas fa-exchange-alt text-emerald-500 mr-2"></i> Mutasi Stok
      </h1>
      <p class="text-slate-400 text-sm mt-1">Catat dan pantau pergerakan obat keluar masuk gudang.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-1">
        <div class="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
          <h2 class="text-lg font-black text-white mb-6 uppercase tracking-widest border-b border-slate-700 pb-4">
            Input Transaksi
          </h2>
          
          <form @submit.prevent="submitTransaksi" class="space-y-6">
            <div>
              <label class="block text-slate-400 text-xs font-black uppercase tracking-widest mb-2 ml-1">Nama Obat</label>
              <select v-model="form.id_obat" class="w-full p-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                <option value="" disabled>-- Pilih Obat dari Gudang --</option>
                <option v-for="m in medicines" :key="m.id" :value="m.id" class="bg-slate-800">
                  {{ m.nama_obat }} (Stok: {{ m.stok }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-slate-400 text-xs font-black uppercase tracking-widest mb-3 ml-1">Tipe Mutasi</label>
              <div class="grid grid-cols-2 gap-4">
                <label :class="form.tipe_transaksi === 'Masuk' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700'" class="flex items-center justify-center p-4 border rounded-2xl cursor-pointer transition-all group">
                  <input type="radio" v-model="form.tipe_transaksi" value="Masuk" class="hidden">
                  <span :class="form.tipe_transaksi === 'Masuk' ? 'text-emerald-500' : 'text-slate-500'" class="font-black text-sm">
                    <i class="fas fa-plus-circle mr-2"></i> MASUK
                  </span>
                </label>
                <label :class="form.tipe_transaksi === 'Keluar' ? 'border-rose-500 bg-rose-500/10' : 'border-slate-700'" class="flex items-center justify-center p-4 border rounded-2xl cursor-pointer transition-all group">
                  <input type="radio" v-model="form.tipe_transaksi" value="Keluar" class="hidden">
                  <span :class="form.tipe_transaksi === 'Keluar' ? 'text-rose-500' : 'text-slate-500'" class="font-black text-sm">
                    <i class="fas fa-minus-circle mr-2"></i> KELUAR
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-slate-400 text-xs font-black uppercase tracking-widest mb-2 ml-1">Kuantitas (Qty)</label>
              <input v-model="form.jumlah" type="number" min="1" class="w-full p-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="0">
            </div>

            <button :disabled="loading" type="submit" 
              :class="form.tipe_transaksi === 'Masuk' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20'"
              class="w-full py-4 rounded-2xl font-black text-white transition-all shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2">
              <span v-if="loading"><i class="fas fa-circle-notch animate-spin"></i></span>
              <span v-else>SIMPAN TRANSAKSI</span>
            </button>
          </form>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div class="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-700/20">
            <h2 class="text-lg font-black text-white uppercase tracking-widest">Riwayat Terakhir</h2>
            <button @click="fetchData" class="text-emerald-500 hover:text-emerald-400 transition-colors">
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-900/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th class="p-5">Waktu Transaksi</th>
                  <th class="p-5">Obat</th>
                  <th class="p-5">Status</th>
                  <th class="p-5">Qty</th>
                  <th class="p-5">Petugas</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700/50 text-sm">
                <tr v-for="t in transactions.slice(0, 10)" :key="t.id" class="hover:bg-slate-700/20 transition-all group">
                  <td class="p-5 text-slate-400 font-mono text-xs">
                    {{ new Date(t.tanggal).toLocaleString('id-ID') }}
                  </td>
                  <td class="p-5 font-bold text-white uppercase">{{ t.nama_obat }}</td>
                  <td class="p-5">
                    <span :class="t.tipe_transaksi === 'Masuk' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'" 
                      class="px-3 py-1 rounded-full text-[10px] font-black border">
                      {{ t.tipe_transaksi.toUpperCase() }}
                    </span>
                  </td>
                  <td class="p-5 font-black text-slate-300">{{ t.jumlah }}</td>
                  <td class="p-5">
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-[10px] text-white">
                        <i class="fas fa-user-circle"></i>
                      </div>
                      <span class="text-slate-400 text-xs">{{ t.username }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-if="transactions.length === 0">
                  <td colspan="5" class="p-20 text-center">
                    <div class="flex flex-col items-center opacity-20">
                      <i class="fas fa-folder-open text-6xl mb-4"></i>
                      <p class="font-black tracking-widest text-sm uppercase">Belum ada aktivitas mutasi</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
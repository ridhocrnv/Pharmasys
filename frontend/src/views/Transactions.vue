<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';

const medicines = ref([]);
const transactions = ref([]);
const loading = ref(false);

const form = ref({
  id_obat: '',
  tipe_transaksi: 'Masuk',
  jumlah: 1
});

const fetchData = async () => {
  try {
    const [resMed, resHistory] = await Promise.all([
      api.get('/medicines'),
      api.get('/reports/history')
    ]);
    medicines.value = resMed.data;
    transactions.value = resHistory.data;
  } catch (err) {
    console.error("Error Fetch:", err.response?.data);
    // Jika muncul error 403 di sini, berarti poin nomor 1 di atas belum benar
  }
};

const submitTransaksi = async () => {
  try {
    await api.post('/transactions', form.value);
    
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Transaksi telah dicatat',
      timer: 1500,
      showConfirmButton: false,
      background: '#1e293b',
      color: '#fff'
    });

    form.value = { id_obat: '', tipe_transaksi: 'Masuk', jumlah: 1 };
    await fetchData(); // <--- REFRESH DATA RIWAYAT SECARA OTOMATIS
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Transaksi Gagal',
      text: err.response?.data?.message || 'Terjadi kesalahan sistem',
      background: '#1e293b',
      color: '#fff'
    });
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    <div class="lg:col-span-1">
      <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
        <h2 class="text-xl font-bold mb-6 text-white border-b border-gray-700 pb-2">Catat Transaksi</h2>
        
        <form @submit.prevent="submitTransaksi" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-1">Pilih Obat</label>
            <select v-model="form.id_obat" class="w-full p-2.5 bg-gray-700 rounded border border-gray-600 text-white focus:ring-blue-500">
              <option value="">-- Pilih Obat --</option>
              <option v-for="m in medicines" :key="m.id" :value="m.id">
                {{ m.nama_obat }} (Stok: {{ m.stok }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-1">Tipe Transaksi</label>
            <div class="flex gap-4">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" v-model="form.tipe_transaksi" value="Masuk" class="text-blue-600">
                <span>Obat Masuk</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" v-model="form.tipe_transaksi" value="Keluar" class="text-red-600">
                <span>Obat Keluar</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-1">Jumlah (Qty)</label>
            <input v-model="form.jumlah" type="number" min="1" class="w-full p-2.5 bg-gray-700 rounded border border-gray-600 text-white">
          </div>

          <button :disabled="loading" type="submit" 
            :class="form.tipe_transaksi === 'Masuk' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
            class="w-full py-3 rounded-lg font-bold text-white transition duration-200 mt-4 disabled:opacity-50">
            {{ loading ? 'Memproses...' : 'Simpan Transaksi' }}
          </button>
        </form>
      </div>
    </div>

    <div class="lg:col-span-2">
      <div class="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
        <div class="p-6 border-b border-gray-700">
          <h2 class="text-xl font-bold text-white">Riwayat Transaksi Terakhir</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-700/50 text-gray-400 text-xs uppercase">
              <tr>
                <th class="p-4">Tanggal</th>
                <th class="p-4">Obat</th>
                <th class="p-4">Tipe</th>
                <th class="p-4">Jumlah</th>
                <th class="p-4">Petugas</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700 text-sm">
              <tr v-for="t in transactions.slice(0, 10)" :key="t.id" class="hover:bg-gray-750 transition">
                <td class="p-4 text-gray-400">{{ new Date(t.tanggal).toLocaleString('id-ID') }}</td>
                <td class="p-4 font-medium">{{ t.nama_obat }}</td>
                <td class="p-4">
                  <span :class="t.tipe_transaksi === 'Masuk' ? 'text-green-400' : 'text-red-400'" class="font-bold">
                    {{ t.tipe_transaksi }}
                  </span>
                </td>
                <td class="p-4">{{ t.jumlah }}</td>
                <td class="p-4 text-gray-400">{{ t.username }}</td>
              </tr>
              <tr v-if="transactions.length === 0">
                <td colspan="5" class="p-8 text-center text-gray-500">Belum ada riwayat transaksi.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>
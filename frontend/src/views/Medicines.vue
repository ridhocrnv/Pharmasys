<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';
import Swal from 'sweetalert2';

// State
const medicines = ref([]);
const suppliers = ref([]);
const showModal = ref(false);
const isEdit = ref(false);

// Form State
const form = ref({
  id: null,
  nama_obat: '',
  jenis_obat: '',
  satuan: '',
  stok: 0,
  id_supplier: '',
  id_lokasi: 1 // Default ke lokasi 1 jika belum ada fitur kelola lokasi
});

// Alert Toast Configuration
const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

// 1. Fungsi Ambil Data (Penyebab Utama Gagal Data)
const fetchData = async () => {
  try {
    const [resMed, resSup] = await Promise.all([
      api.get('/medicines'),
      api.get('/suppliers')
    ]);
    medicines.value = resMed.data;
    suppliers.value = resSup.data;
  } catch (err) {
    console.error(err);
    Swal.fire('Error!', 'Gagal mengambil data dari server.', 'error');
  }
};

// 2. Fungsi Modal
const openModal = (item = null) => {
  if (item) {
    isEdit.value = true;
    form.value = { ...item };
  } else {
    isEdit.value = false;
    form.value = {
      id: null,
      nama_obat: '',
      jenis_obat: '',
      satuan: '',
      stok: 0,
      id_supplier: '',
      id_lokasi: 1
    };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// 3. Handle Simpan
const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/medicines/${form.value.id}`, form.value);
      toast.fire({ icon: 'success', title: 'Data obat diperbarui' });
    } else {
      await api.post('/medicines', form.value);
      toast.fire({ icon: 'success', title: 'Obat berhasil ditambah' });
    }
    closeModal();
    fetchData();
  } catch (err) {
    Swal.fire('Error!', 'Gagal menyimpan data. Pastikan semua field terisi.', 'error');
  }
};

// 4. Handle Hapus
const deleteObat = async (id) => {
  const result = await Swal.fire({
    title: 'Hapus Obat?',
    text: "Data yang dihapus tidak bisa dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Ya, Hapus!',
    background: '#1e293b',
    color: '#fff'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/medicines/${id}`);
      fetchData();
      Swal.fire('Terhapus!', 'Data obat telah dibuang.', 'success');
    } catch (err) {
      Swal.fire('Gagal!', 'Data gagal dihapus.', 'error');
    }
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-black tracking-tight text-white">
        <i class="fas fa-pills text-emerald-500 mr-2"></i> Inventori Obat
      </h2>
      <button @click="openModal()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-lg transition-all">
        <i class="fas fa-plus"></i> <span>Tambah Obat</span>
      </button>
    </div>

    <div class="bg-slate-800/50 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-700/30 text-slate-400 text-xs uppercase tracking-widest font-black">
            <th class="p-5">Informasi Obat</th>
            <th class="p-5">Stok Saat Ini</th>
            <th class="p-5">Supplier</th>
            <th class="p-5 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/50">
          <tr v-for="m in medicines" :key="m.id" class="hover:bg-slate-700/20 transition-colors">
            <td class="p-5">
              <div class="font-bold text-white">{{ m.nama_obat }}</div>
              <div class="text-xs text-slate-500 italic">{{ m.jenis_obat }}</div>
            </td>
            <td class="p-5">
              <div :class="m.stok < 10 ? 'text-red-400' : 'text-emerald-400'" class="font-mono font-bold text-lg">
                {{ m.stok }} <span class="text-xs font-normal text-slate-500">{{ m.satuan }}</span>
              </div>
            </td>
            <td class="p-5 text-slate-400 text-sm">
              <i class="fas fa-truck-medical mr-1 opacity-50"></i> {{ m.nama_supplier || 'Tidak ada supplier' }}
            </td>
            <td class="p-5">
              <div class="flex justify-center space-x-2">
                <button @click="openModal(m)" class="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="deleteObat(m.id)" class="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-6">
          {{ isEdit ? 'Edit Data Obat' : 'Tambah Obat Baru' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="text-xs text-slate-400 uppercase font-black mb-1 block">Nama Obat</label>
            <input v-model="form.nama_obat" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" required>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-slate-400 uppercase font-black mb-1 block">Jenis</label>
              <input v-model="form.jenis_obat" type="text" placeholder="Tab/Cair" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none">
            </div>
            <div>
              <label class="text-xs text-slate-400 uppercase font-black mb-1 block">Satuan</label>
              <input v-model="form.satuan" type="text" placeholder="Strip/Botol" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none">
            </div>
          </div>
          <div>
            <label class="text-xs text-slate-400 uppercase font-black mb-1 block">Supplier</label>
            <select v-model="form.id_supplier" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" required>
              <option value="">Pilih Supplier</option>
              <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.nama_supplier }}</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3 pt-6">
            <button type="button" @click="closeModal" class="px-6 py-2 text-slate-400 hover:text-white transition">Batal</button>
            <button type="submit" class="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
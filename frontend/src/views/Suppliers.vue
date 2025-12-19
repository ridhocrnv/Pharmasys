<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';
import Swal from 'sweetalert2';

const suppliers = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const form = ref({ id: null, nama_supplier: '', kontak: '', alamat: '' });

const fetchSuppliers = async () => {
  try {
    const res = await api.get('/suppliers');
    suppliers.value = res.data;
  } catch (err) { console.error(err); }
};

const openModal = (item = null) => {
  isEdit.value = !!item;
  form.value = item ? { ...item } : { id: null, nama_supplier: '', kontak: '', alamat: '' };
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; };

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/suppliers/${form.value.id}`, form.value);
    } else {
      await api.post('/suppliers', form.value);
    }
    Swal.fire({ icon: 'success', title: 'Berhasil!', timer: 1500 });
    closeModal();
    fetchSuppliers();
  } catch (err) { Swal.fire('Error', 'Gagal menyimpan data', 'error'); }
};

const deleteSupplier = async (id) => {
  const result = await Swal.fire({
    title: 'Hapus Supplier?',
    text: "Data obat dengan supplier ini mungkin akan terdampak.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    background: '#1e293b',
    color: '#fff'
  });

  if (result.isConfirmed) {
    await api.delete(`/suppliers/${id}`);
    fetchSuppliers();
    Swal.fire('Terhapus!', 'Data supplier telah dihapus.', 'success');
  }
};

onMounted(fetchSuppliers);
</script>

<template>
  <div class="space-y-6 p-4">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-black text-white">
        <i class="fas fa-truck-field text-emerald-500 mr-2"></i> Mitra Supplier
      </h2>
      <button @click="openModal()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-emerald-900/20">
        <i class="fas fa-plus mr-2"></i> Tambah Supplier
      </button>
    </div>

    <div class="bg-slate-800/50 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
      <table class="w-full text-left">
        <thead class="bg-slate-700/30 text-slate-400 text-xs uppercase tracking-widest font-black">
          <tr>
            <th class="p-5">Nama Perusahaan</th>
            <th class="p-5">Kontak</th>
            <th class="p-5">Alamat</th>
            <th class="p-5 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/50">
          <tr v-for="s in suppliers" :key="s.id" class="hover:bg-slate-700/20 transition-colors">
            <td class="p-5 font-bold text-white">{{ s.nama_supplier }}</td>
            <td class="p-5 text-emerald-400 font-mono text-sm">{{ s.kontak }}</td>
            <td class="p-5 text-slate-400 text-sm max-w-xs truncate">{{ s.alamat }}</td>
            <td class="p-5">
              <div class="flex justify-center space-x-2">
                <button @click="openModal(s)" class="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="deleteSupplier(s.id)" class="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
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
        <h3 class="text-xl font-bold text-white mb-6">{{ isEdit ? 'Update Supplier' : 'Supplier Baru' }}</h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <input v-model="form.nama_supplier" placeholder="Nama Supplier" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" required>
          <input v-model="form.kontak" placeholder="Nomor Telepon" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500">
          <textarea v-model="form.alamat" placeholder="Alamat Lengkap" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" rows="3"></textarea>
          <div class="flex justify-end space-x-3 pt-6">
            <button type="button" @click="closeModal" class="px-6 py-2 text-slate-400">Batal</button>
            <button type="submit" class="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
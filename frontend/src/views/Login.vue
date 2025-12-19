<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';
import Swal from 'sweetalert2';

const username = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  try {
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    });
    
    // Simpan token dan info user ke LocalStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.user.role);
    localStorage.setItem('username', response.data.user.username);
    
    // Notifikasi Sukses menggunakan SweetAlert2 Toast
    Swal.fire({
      icon: 'success',
      title: 'Login Berhasil',
      text: `Selamat bekerja, ${response.data.user.username}!`,
      timer: 1500,
      showConfirmButton: false,
      background: '#1e293b',
      color: '#fff',
      iconColor: '#10b981'
    });
    
    router.push('/dashboard');
  } catch (err) {
    // Notifikasi Gagal menggunakan SweetAlert2
    Swal.fire({
      icon: 'error',
      title: 'Akses Ditolak',
      text: err.response?.data?.message || 'Username atau password salah!',
      background: '#1e293b',
      color: '#fff',
      confirmButtonColor: '#10b981'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0f172a] font-sans">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative bg-slate-800/50 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700/50">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 rounded-2xl mb-4 shadow-inner">
          <i class="fas fa-hospital-user text-4xl text-emerald-500"></i>
        </div>
        <h2 class="text-3xl font-black text-white tracking-tight">PHARMA<span class="text-emerald-500">SYS</span></h2>
        <p class="text-slate-400 text-sm mt-2 font-medium">Sistem Manajemen Inventori Obat</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-slate-400 text-xs font-black uppercase tracking-widest mb-2 ml-1">Username</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
              <i class="fas fa-user"></i>
            </span>
            <input 
              v-model="username" 
              type="text" 
              class="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
              placeholder="Masukkan username"
              required
            >
          </div>
        </div>

        <div>
          <label class="block text-slate-400 text-xs font-black uppercase tracking-widest mb-2 ml-1">Password</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
              <i class="fas fa-lock"></i>
            </span>
            <input 
              v-model="password" 
              type="password" 
              class="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
              placeholder="••••••••"
              required
            >
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-900/20 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <span v-if="loading"><i class="fas fa-circle-notch animate-spin mr-2"></i> Memproses...</span>
          <span v-else>MASUK KE SISTEM</span>
        </button>
      </form>

      <p class="text-center text-slate-500 text-[10px] mt-8 uppercase font-bold tracking-widest">
        &copy; 2025 Pharmasys. All rights reserved.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Transisi halus untuk input focus */
input {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
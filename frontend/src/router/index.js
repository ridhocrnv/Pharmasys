import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';
import Reports from '../views/Reports.vue';
import Suppliers from '../views/Suppliers.vue';
import DashboardHome from '../views/DashboardHome.vue';

// Import views (kita akan buat filenya setelah ini)
import Medicines from '../views/Medicines.vue';
// View lainnya bisa dibuat menyusul
const Placeholder = { template: '<div class="p-6 text-white">Fitur sedang dikembangkan</div>' };

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: Login },
    {
        path: '/dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'DashboardHome',
                component: DashboardHome,
                meta: { role: ['Admin', 'Petugas Gudang', 'Apoteker'] } // Semua role bisa akses
            },
            {
                path: '/medicines',
                name: 'Medicines',
                component: Medicines,
                meta: { role: ['Admin'] } // Hanya Admin
            },
            { 
                path: '/suppliers', 
                name: 'Suppliers', 
                component: Suppliers, 
                meta: { role: ['Admin'] } 
            },
            {
                path: '/transactions',
                name: 'Transactions',
                component: Transactions,
                meta: { role: ['Admin', 'Petugas Gudang'] }
            },
            {
                path: '/reports',
                name: 'Reports',
                component: Reports,
                meta: { role: ['Admin', 'Apoteker'] }
            },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    // 1. Cek Login
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    }
    // 2. Cek Hak Akses (Role)
    else if (to.meta.role && !to.meta.role.includes(userRole)) {
        alert("Akses Ditolak: Anda tidak memiliki izin untuk halaman ini.");
        next('/dashboard');
    }
    else {
        next();
    }
});

export default router;
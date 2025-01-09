import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '@/presentation/views/Login.vue';
import RoomList from '@/presentation/views/RoomList.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: RoomList,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); // Replace with your auth logic
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router; 
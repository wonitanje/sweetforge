import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
  name: 'home',
  path: '/',
  component: () => import('@/views/Home.vue'),
}, {
  name: 'constructor',
  path: '/constructor',
  redirect: { name: 'package' },
  component: () => import('@/layouts/Constructor.vue'),
  children: [{
    name: 'package',
    path: 'package',
    component: () => import('@/components/vPackage.vue'),
  }, {
    name: 'sweet',
    path: 'sweet',
    component: () => import('@/components/vSweet.vue'),
  }],
}, {
  name: 'order',
  path: '/order',
  component: () => import('@/views/Order.vue'),
}, {
  name: 'share-link',
  path: '/share-link/:id',
  component: () => import('@/views/ShareLink.vue'),
}, {
  name: 'admin',
  path: '/juswee-production-ap',
  component: () => import('@/layouts/Admin.vue'),
  redirect: { name: '404' },
  children: [{
    name: 'admin-panel',
    path: 'admin-panel',
    component: () => import('@/views/AdminPanel.vue'),
  }, {
    name: 'add-stock',
    path: 'add-stock',
    component: () => import('@/views/AddStock.vue'),
  }, {
    name: 'setup-stock',
    path: 'setup-stock',
    component: () => import('@/views/SetupStock.vue'),
  }],
}, {
  name: '404',
  path: "/:pathMatch(.*)*",
  component: () => import('@/views/404.vue'),
}, {
  name: 'page-not-found',
  path: "/:pathMatch(.*)*",
  redirect: { name: '404' },
}]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
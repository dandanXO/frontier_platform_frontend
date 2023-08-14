import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/clothes/:clothesId(1|2|3|4)',
    name: 'clothes-detail',
    component: () => import('@/views/ClothesDetail.vue'),
    props: true,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  sensitive: true,
})

export default router

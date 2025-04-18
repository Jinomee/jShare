import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Upload',
    component: () => import('@/views/Upload.vue')
  },
  {
    path: '/files',
    name: 'Files',
    component: () => import('@/views/Files.vue')
  },
  {
    path: '/share/:shareId',
    name: 'ShareView',
    component: () => import('@/views/ShareView.vue'),
    props: true
  },
  {
    path: '/shares',
    name: 'Shares',
    component: () => import('@/views/Shares.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // Always scroll to top
    return { top: 0 }
  }
})

export default router

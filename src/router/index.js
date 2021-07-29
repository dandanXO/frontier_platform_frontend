import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Lobby',
    meta: {
      requiresLogin: true
    },
    component: () => import('@/views/Lobby.vue'),
    beforeEnter: async (to, from, next) => {
      store.dispatch('code/getCountryList')
      store.dispatch('user/getUserOrgList')
      next()
    }
  },
  {
    path: '/public-library',
    name: 'PublicLibrary',
    meta: {
      requiresLogin: true
    },
    component: () => import('@/views/PublicLibrary.vue')
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    meta: {
      requiresLogin: false
    },
    component: () => import('@/views/SignUp.vue'),
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('accessToken') !== null) {
        return next('/')
      }
      next()
    }
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    meta: {
      requiresLogin: false
    },
    component: () => import('@/views/SignIn.vue'),
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('accessToken') !== null) {
        return next('/')
      }
      next()
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    meta: {
      requiresLogin: false
    },
    beforeEnter: (to, from, next) => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.replace('https://frontier.cool/')
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresLogin) {
    await store.dispatch('user/getUser')
    next()
  } else {
    next()
  }
})

export default router

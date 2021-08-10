import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
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
  },
  {
    path: '/',
    name: 'Lobby',
    meta: {
      requiresLogin: true
    },
    component: () => import('@/views/Lobby.vue'),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('code/getCountryList')
      await store.dispatch('user/getUserOrgList')
      next()
    }
  },
  {
    path: '/:orgName',
    name: 'InnerAppLayout',
    meta: {
      requiresLogin: true
    },
    component: () => import('@/views/innerApp/InnerAppLayout.vue'),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('organization/getOrg', { orgName: to.params.orgName })
      next()
    },
    children: [
      {
        path: 'public-library',
        name: 'PublicLibrary',
        component: () => import('@/views/innerApp/PublicLibrary.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresLogin) {
    await store.dispatch('user/getUser', { orgName: to.params.orgName })
    next()
  } else {
    next()
  }
})

export default router

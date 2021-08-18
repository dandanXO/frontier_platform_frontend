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
      next()
    }
  },
  {
    path: '/:orgName',
    redirect: to => `/${to.params.orgName}/public-library`,
    name: 'InnerAppLayout',
    meta: {
      requiresLogin: true
    },
    component: () => import('@/views/innerApp/InnerAppLayout.vue'),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('user/orgUser/getOrgUser', { orgName: to.params.orgName })
      await store.dispatch('organization/getOrg', { orgName: to.params.orgName })
      next()
    },
    children: [
      {
        path: 'public-library',
        name: 'PublicLibrary',
        component: () => import('@/views/innerApp/PublicLibrary.vue')
      },
      {
        path: 'management',
        redirect: to => `/${to.params.orgName}/management/about`,
        name: 'Management',
        component: () => import('@/views/innerApp/management/Management.vue'),
        children: [
          {
            path: ':tab(about|members|history)',
            name: 'ManagementOrg',
            props: true,
            component: () => import('@/views/innerApp/management/ManagementOrg.vue'),
            beforeEnter: async (to, from, next) => {
              await store.dispatch('code/getCountryList')
              next()
            }
          },
          {
            path: ':groupId(\\d+)/:tab(about|members|history)',
            name: 'ManagementGroup',
            props: true,
            component: () => import('@/views/innerApp/management/ManagementGroup.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  sensitive: true
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

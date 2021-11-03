import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { ROLE_ID } from '@/utils/constants'

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
    path: '/invite-link',
    name: 'InviteLink',
    meta: {
      requiresLogin: true
    },
    component: () => import('@/views/PassThrough'),
    beforeEnter: async (to, from, next) => {
      const { from: fromWhere, inviteCode, orgNo } = to.query

      const organizationList = store.getters['user/organizationList']
      if (organizationList.some(org => Number(org.orgNo) === Number(orgNo))) {
        return next(`/${orgNo}`)
      }

      if (fromWhere === 'org') {
        await store.dispatch('organization/joinOrgViaLink', { inviteCode })
      } else if (fromWhere === 'group') {
        await store.dispatch('group/joinGroupViaLink', { inviteCode })
      }
      await store.dispatch('user/getUser')
      return next(`/${orgNo}`)
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
      await store.dispatch('code/getOrgCategoryList')
      await store.dispatch('code/getRoleList')
      await store.dispatch('code/getRoleLimitTable')
      next()
    }
  },
  {
    path: '/:orgNo',
    redirect: to => `/${to.params.orgNo}/public-library`,
    name: 'InnerAppLayout',
    meta: {
      requiresLogin: true
    },
    component: () => import('@/views/innerApp/InnerAppLayout.vue'),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('user/orgUser/getOrgUser', { orgNo: to.params.orgNo })
      await store.dispatch('organization/getOrg', { orgNo: to.params.orgNo })
      const org = store.getters['organization/organization']
      const orgUser = store.getters['user/orgUser/orgUser']

      if (orgUser.orgRoleId === ROLE_ID.OWNER && org.uploadMaterialEmail === '') {
        store.dispatch('helper/openModal', {
          component: 'modal-create-mail-org',
          properties: {
            isOldOrg: true
          },
          closable: false
        })
      }
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
        redirect: to => `/${to.params.orgNo}/management/about`,
        name: 'Management',
        component: () => import('@/views/innerApp/management/Management.vue'),
        children: [
          {
            path: ':tab(about|members|history)',
            name: 'ManagementOrg',
            props: true,
            component: () => import('@/views/innerApp/management/ManagementOrg.vue'),
            beforeEnter: async (to, from, next) => {
              await store.dispatch('organization/getOrg', { orgNo: to.params.orgNo })
              await store.dispatch('code/getCountryList')
              await store.dispatch('code/getOrgCategoryList')
              await store.dispatch('code/getRoleList')
              await store.dispatch('code/getRoleLimitTable')
              next()
            }
          },
          {
            path: ':groupId(\\d+)/:tab(about|members|history)',
            name: 'ManagementGroup',
            props: true,
            component: () => import('@/views/innerApp/management/ManagementGroup.vue'),
            beforeEnter: async (to, from, next) => {
              await store.dispatch('code/getRoleList')
              await store.dispatch('code/getRoleLimitTable')
              await store.dispatch('group/getGroup', { groupId: to.params.groupId })
              next()
            }
          }
        ]
      },
      {
        path: 'global-search',
        name: 'GlobalSearch',
        component: () => import('@/views/innerApp/GlobalSearch.vue')
      },
      {
        path: 'favorites',
        name: 'Favorites',
        component: () => import('@/views/innerApp/Favorites.vue')
      },
      {
        path: 'workspace',
        name: 'OrgWorkspace',
        component: () => import('@/views/innerApp/Workspace.vue')
      },
      {
        path: 'assets',
        name: 'OrgAssets',
        component: () => import('@/views/innerApp/Assets.vue'),
        beforeEnter: async (to, from, next) => {
          await store.dispatch('code/getFilterOptions')
          next()
        }
      },
      {
        path: 'assets/upload',
        name: 'OrgUploadAssets',
        component: () => import('@/views/innerApp/UploadAssets.vue'),
        beforeEnter: async (to, from, next) => {
          await store.dispatch('code/getCountryList')
          next()
        }
      },
      {
        path: 'share-to-me',
        name: 'OrgShareToMe',
        component: () => import('@/views/innerApp/ShareToMe.vue')
      },
      {
        path: 'sticker',
        name: 'OrgSticker',
        component: () => import('@/views/innerApp/Sticker.vue')
      },
      {
        path: ':groupId(\\d+)',
        redirect: to => `/${to.params.orgNo}/${to.params.groupId}/workspace`,
        component: () => import('@/views/PassThrough'),
        beforeEnter: async (to, from, next) => {
          await store.dispatch('group/getGroup', { groupId: to.params.groupId })
          next()
        },
        children: [
          {
            path: 'assets',
            name: 'GroupAssets',
            component: () => import('@/views/innerApp/Assets.vue')
          },
          {
            path: 'assets/upload',
            name: 'GroupUploadAssets',
            component: () => import('@/views/innerApp/UploadAssets.vue')
          },
          {
            path: 'workspace',
            name: 'GroupWorkspace',
            component: () => import('@/views/innerApp/Workspace.vue')
          },
          {
            path: 'share-to-me',
            name: 'GroupShareToMe',
            component: () => import('@/views/innerApp/ShareToMe.vue')
          },
          {
            path: 'sticker',
            name: 'GroupSticker',
            component: () => import('@/views/innerApp/Sticker.vue')
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

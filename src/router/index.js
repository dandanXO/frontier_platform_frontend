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
      next()
    }
  },
  {
    path: '/:orgNo',
    redirect: to => `/${to.params.orgNo}/public-library`,
    name: 'OrgRoot',
    meta: {
      requiresLogin: true
    },
    component: () => import('@/views/innerApp/InnerAppLayout.vue'),
    beforeEnter: async (to, from, next) => {
      store.commit('helper/SET_routeLocation', 'org')
      await store.dispatch('user/orgUser/getOrgUser', { orgNo: to.params.orgNo })
      await store.dispatch('organization/getOrg', { orgNo: to.params.orgNo })
      const org = store.getters['organization/organization']
      const orgUser = store.getters['user/orgUser/orgUser']
      if (orgUser.orgRoleId === ROLE_ID.OWNER && !org.uploadMaterialEmail) {
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
        path: 'management/:tab(about|members|history)',
        name: 'OrgManagement',
        component: () => import('@/views/innerApp/Management.vue')
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
        component: () => import('@/views/PassThrough'),
        children: [
          {
            path: '',
            name: 'OrgAssets',
            component: () => import('@/views/innerApp/assets/Assets.vue'),
            beforeEnter: async (to, from, next) => {
              await store.dispatch('code/getFilterOptions')
              next()
            }
          },
          {
            path: 'upload',
            name: 'OrgAssetsUpload',
            component: () => import('@/views/innerApp/assets/AssetsUpload.vue')
          },
          {
            path: 'upload/manual',
            name: 'OrgAssetsMaterialCreate',
            component: () => import('@/views/innerApp/assets/AssetsMaterialCreate.vue')
          },
          {
            path: ':materialId',
            name: 'OrgAssetsMaterialDetail',
            component: () => import('@/views/innerApp/assets/AssetsMaterialDetail.vue')
          },
          {
            path: ':materialId/edit',
            name: 'OrgAssetsMaterialEdit',
            component: () => import('@/views/innerApp/assets/AssetsMaterialEdit.vue'),
            beforeEnter: async (to, from, next) => {
              await store.dispatch('material/getMaterial', { materialId: to.params.materialId })
              next()
            }
          }
        ]
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
      }
    ]
  },
  {
    path: '/:orgNo/:groupId(\\d+)',
    name: 'GroupRoot',
    redirect: to => `/${to.params.orgNo}/${to.params.groupId}/assets`,
    meta: {
      requiresLogin: true
    },
    component: () => import('@/views/innerApp/InnerAppLayout.vue'),
    beforeEnter: async (to, from, next) => {
      store.commit('helper/SET_routeLocation', 'group')
      await store.dispatch('organization/getOrg', { orgNo: to.params.orgNo })
      await store.dispatch('group/getGroup', { groupId: to.params.groupId })
      next()
    },
    children: [
      {
        path: 'management/:tab(about|members|history)',
        name: 'GroupManagement',
        props: true,
        component: () => import('@/views/innerApp/Management.vue')
      },
      {
        path: 'assets',
        component: () => import('@/views/PassThrough'),
        children: [
          {
            path: '',
            name: 'GroupAssets',
            component: () => import('@/views/innerApp/assets/Assets.vue'),
            beforeEnter: async (to, from, next) => {
              await store.dispatch('code/getFilterOptions')
              next()
            }
          },
          {
            path: 'upload',
            name: 'GroupAssetsUpload',
            component: () => import('@/views/innerApp/assets/AssetsUpload.vue')
          },
          {
            path: 'upload/manual',
            name: 'GroupAssetsMaterialCreate',
            component: () => import('@/views/innerApp/assets/AssetsMaterialCreate.vue')
          },
          {
            path: ':materialId',
            name: 'GroupAssetsMaterialDetail',
            component: () => import('@/views/innerApp/assets/AssetsMaterialDetail.vue')
          },
          {
            path: ':materialId/edit',
            name: 'GroupAssetsMaterialEdit',
            component: () => import('@/views/innerApp/assets/AssetsMaterialEdit.vue'),
            beforeEnter: async (to, from, next) => {
              await store.dispatch('material/getMaterial', { materialId: to.params.materialId })
              next()
            }
          }
        ]
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

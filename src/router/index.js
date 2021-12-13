import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { ROLE_ID } from '@/utils/constants'
import Sidebar from '@/components/layout/sidebar/Sidebar.vue'

const checkUserIsVerify = (to, from, next) => {
  const user = store.getters['user/user']
  if (!user.isVerify) {
    store.dispatch('helper/openModal', {
      component: 'modal-verify-notification'
    })
    return next('/')
  }
  next()
}

const reuseRoutes = (prefix) => ([
  {
    path: 'management/:tab(about|members|history)',
    name: `${prefix}Management`,
    component: () => import('@/views/innerApp/Management.vue')
  },
  {
    path: 'assets',
    component: () => import('@/views/PassThrough'),
    children: [
      {
        path: '',
        name: `${prefix}Assets`,
        component: () => import('@/views/innerApp/assets/Assets.vue')
      },
      {
        path: 'upload',
        name: `${prefix}AssetsUpload`,
        component: () => import('@/views/innerApp/assets/AssetsUpload.vue')
      },
      {
        path: 'upload/manual',
        name: `${prefix}AssetsMaterialCreate`,
        component: () => import('@/views/innerApp/assets/AssetsMaterialCreate.vue')
      },
      {
        path: 'merge',
        name: `${prefix}AssetsMaterialMerge`,
        component: () => import('@/views/innerApp/assets/AssetsMaterialMerge.vue'),
        beforeEnter: (to, from, next) => {
          if ([`${prefix}Assets`, `${prefix}AssetsMaterialMergePreview`].includes(from.name)) {
            next()
          } else {
            next(to.path.replace('/merge', ''))
          }
        }
      },
      {
        path: 'merge/preview',
        name: `${prefix}AssetsMaterialMergePreview`,
        component: () => import('@/views/innerApp/assets/AssetsMaterialMergePreview.vue'),
        beforeEnter: (to, from, next) => {
          if ([`${prefix}AssetsMaterialMerge`].includes(from.name)) {
            next()
          } else {
            next(to.path.replace('/merge/preview', ''))
          }
        }
      },
      {
        path: ':materialId',
        name: `${prefix}AssetsMaterialDetail`,
        component: () => import('@/views/innerApp/assets/AssetsMaterialDetail.vue')
      },
      {
        path: ':materialId/edit',
        name: `${prefix}AssetsMaterialEdit`,
        component: () => import('@/views/innerApp/assets/AssetsMaterialEdit.vue')
      }
    ]
  },
  {
    path: 'workspace',
    name: `${prefix}Workspace`,
    component: () => import('@/views/innerApp/Workspace.vue')
  },
  {
    path: 'share-to-me',
    name: `${prefix}ShareToMe`,
    component: () => import('@/views/innerApp/ShareToMe.vue')
  },
  {
    path: 'sticker',
    name: `${prefix}Sticker`,
    component: () => import('@/views/innerApp/Sticker.vue')
  }
])

const routes = [
  {
    path: '/sign-up',
    name: 'SignUp',
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
    component: () => import('@/views/SignIn.vue'),
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('accessToken') !== null) {
        return next('/')
      }
      next()
    }
  },
  {
    path: '/plan',
    name: 'Plan',
    component: () => import('@/views/Plan.vue')
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.replace('https://frontier.cool/')
    }
  },
  {
    path: '/verify-user',
    name: 'VerifyUser',
    beforeEnter: async (to, from, next) => {
      const { verifyCode } = to.query
      await store.dispatch('user/verifyUser', { verifyCode })
      next('/')
    }
  },
  {
    path: '/',
    name: 'AppRoot',
    component: () => import('@/views/innerApp/InnerAppLayout.vue'),
    beforeEnter: async (to, from, next) => {
      store.dispatch('code/getRoleList')
      store.dispatch('code/getCountryList')
      store.dispatch('code/getFilterOptions')
      await store.dispatch('user/getUser')
      next()
    },
    children: [
      {
        path: '',
        name: 'Lobby',
        component: () => import('@/views/innerApp/Lobby.vue')
      },
      {
        path: 'invite-link',
        name: 'InviteLink',
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
        path: ':orgNo',
        redirect: to => `/${to.params.orgNo}/public-library`,
        name: 'InnerAppRoot',
        components: {
          default: () => import('@/views/PassThrough.vue'),
          sidebar: Sidebar
        },
        beforeEnter: [checkUserIsVerify, async (to, from, next) => {
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
        }],
        children: [
          {
            path: '',
            name: 'OrgRoot',
            component: () => import('@/views/PassThrough'),
            beforeEnter: (to, from, next) => {
              store.commit('helper/SET_routeLocation', 'org')
              next()
            },
            children: reuseRoutes('Org')
          },
          {
            path: ':groupId(\\d+)',
            name: 'GroupRoot',
            redirect: to => `/${to.params.orgNo}/${to.params.groupId}/assets`,
            component: () => import('@/views/PassThrough.vue'),
            beforeEnter: async (to, from, next) => {
              store.commit('helper/SET_routeLocation', 'group')
              await store.dispatch('group/getGroup', { groupId: to.params.groupId })
              next()
            },
            children: reuseRoutes('Group')
          },
          {
            path: 'public-library',
            name: 'PublicLibrary',
            component: () => import('@/views/innerApp/PublicLibrary.vue')
          },
          {
            path: 'public-library/:nodeKey',
            name: 'PublicLibraryMaterialDetail',
            component: () => import('@/views/innerApp/PublicLibraryMaterialDetail.vue')
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

export default router

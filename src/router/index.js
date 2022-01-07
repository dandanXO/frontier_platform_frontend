import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { ROLE_ID, NODE_TYPE } from '@/utils/constants'
import Sidebar from '@/components/layout/sidebar/Sidebar.vue'
import i18n from '@/utils/i18n'

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
        path: ':materialId',
        name: `${prefix}AssetsMaterialDetail`,
        component: () => import('@/views/innerApp/assets/AssetsMaterialDetail.vue')
      },
      {
        path: ':materialId/edit',
        name: `${prefix}AssetsMaterialEdit`,
        component: () => import('@/views/innerApp/assets/AssetsMaterialEdit.vue'),
        props: true
      }
    ]
  },
  {
    path: 'workspace',
    name: `${prefix}Workspace`,
    component: () => import('@/views/innerApp/Workspace.vue')
  },
  {
    path: 'workspace/:nodeKey',
    name: `${prefix}WorkspaceMaterialDetail`,
    component: () => import('@/views/innerApp/WorkspaceMaterialDetail.vue')
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
      await next('/')
      store.commit('helper/PUSH_message', i18n.global.t('AA0086'))
    }
  },
  {
    path: '/share-page',
    name: 'SharePage',
    beforeEnter: async (to, from, next) => {
      const { sharingKey } = to.query
      store.dispatch('code/getFilterOptions')
      await store.dispatch('share/getShareReceivedInfo', { sharingKey })
      if (store.getters['share/share'].workspaceNodeType === NODE_TYPE.COLLECTION) {
        next({ path: '/received-share/collection', query: to.query })
      }
    }
  },
  {
    path: '/received-share',
    name: 'ReceivedShare',
    component: () => import('@/views/receivedShare/ReceivedShareContainer.vue'),
    children: [
      {
        path: 'collection',
        name: 'ReceivedShareCollection',
        component: () => import('@/views/receivedShare/ReceivedShareCollection.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'AppRoot',
    component: () => import('@/views/innerApp/InnerAppLayout.vue'),
    beforeEnter: async (to, from, next) => {
      store.dispatch('code/getRoleList')
      store.dispatch('code/getOrgCategoryList')
      store.dispatch('code/getRoleLimitTable')
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
          await store.dispatch('user/getUser')
          await store.dispatch('organization/getOrg', { orgNo: to.params.orgNo })
          await store.dispatch('user/orgUser/getOrgUser')
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
              await store.dispatch('user/groupUser/getGroupUser')
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

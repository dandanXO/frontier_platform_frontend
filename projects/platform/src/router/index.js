import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { useNotifyStore } from '@/stores/notify'
import { ROLE_ID, OUTER_TYPE } from '@/utils/constants'
import i18n from '@frontier/i18n'
import remindVerifyEmail from '@/utils/remind-verify-email'
import { pageview } from 'vue-gtag'
import { OgType } from '@frontier/platform-web-sdk'
import { config } from 'vue-gtag'
import { resetTracker } from '@frontier/lib'

const checkUserIsVerify = (to, from, next) => {
  const user = store.getters['user/user']
  if (!user.isVerify) {
    remindVerifyEmail()
    resetTracker()

    return next('/')
  }
  next()
}

const checkOrgIsInactive = (to, from, next) => {
  if (to.name === 'Billings') {
    return next()
  }

  const planStatus = store.getters['polling/planStatus']

  if (planStatus.INACTIVE) {
    return next(`/${to.params.orgNo}/billings/plan`)
  } else {
    next()
  }
}

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
    },
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
    },
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      config({
        user_id: null,
      })
      resetTracker()

      window.location.replace('https://frontier.cool/')
    },
  },
  {
    path: '/embed-3d-viewer/:materialId',
    name: 'Embed3DViewer',
    component: () => import('@/views/outerApp/embed3DViewer/Embed3DViewer.vue'),
  },
  {
    path: '/',
    name: 'AppRoot',
    component: () => import('@/views/PassThrough.vue'),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('user/getUser')
      next()
    },
    children: [
      {
        path: '',
        name: 'Lobby',
        component: () => import('@/views/innerApp/Lobby.vue'),
      },
      {
        path: 'invite-link',
        name: 'InviteLink',
        beforeEnter: async (to, from, next) => {
          const { from: fromWhere, inviteCode, orgNo } = to.query

          const organizationList = store.getters['user/organizationList']
          if (
            organizationList.some((org) => Number(org.orgNo) === Number(orgNo))
          ) {
            return next(`/${orgNo}`)
          }

          if (fromWhere === 'org') {
            await store.dispatch('organization/joinOrgViaLink', { inviteCode })
          } else if (fromWhere === 'group') {
            await store.dispatch('group/joinGroupViaLink', { inviteCode })
          }
          return next(`/${orgNo}/public-library`)
        },
      },
      {
        path: 'verify-user',
        name: 'VerifyUser',
        beforeEnter: async (to, from, next) => {
          const { verifyCode } = to.query
          await store.dispatch('user/verifyUser', { verifyCode })
          await next('/')
          const notify = useNotifyStore()
          notify.showNotifySnackbar({ messageText: i18n.global.t('AA0086') })
        },
      },
      {
        path: 'moodboard/:sharingKey',
        name: 'MoodboardReceivedShare',
        props: true,
        component: () => import('@/views/outerApp/MoodboardReceivedShare.vue'),
        beforeEnter: checkUserIsVerify,
      },
    ],
  },
  {
    path: '/:orgNo',
    name: 'InnerAppRoot',
    component: () => import('@/views/innerApp/InnerAppLayout.vue'),
    beforeEnter: [
      async (to, from, next) => {
        await store.dispatch('user/getUser')
        next()
      },
      checkUserIsVerify,
      checkOrgIsInactive,
      async (to, from, next) => {
        await store.dispatch('organization/getOrg', {
          orgNo: to.params.orgNo,
        })

        const apiList = [
          'organization/orgUser/getOrgUser',
          'organization/getPricing',
        ]

        if (to.params.orgNo && !from.params.orgNo) {
          apiList.push('polling/getSidebar')
        }

        await Promise.all(
          apiList.map((actionPath) => store.dispatch(actionPath))
        )

        const org = store.getters['organization/organization']
        const orgUser = store.getters['organization/orgUser/orgUser']
        if (orgUser.orgRoleId === ROLE_ID.OWNER && !org.uploadMaterialEmail) {
          store.dispatch('helper/openModalBehavior', {
            component: 'modal-create-mail-org',
            properties: {
              isOldOrg: true,
              closable: false,
            },
          })
        }
        next()
      },
      async (to, from, next) => {
        const organization = await store.getters['organization/organization']
        // 特殊客戶不給看 sourcing library 導去 dashborad
        if (
          (store.getters['permission/isLittleKingRule'] ||
            store.getters['permission/isFabriSelectAccount']) &&
          to.name === 'PublicLibrary'
        ) {
          return next(
            `/${organization.orgNo}/${OgType.ORG}-${organization.orgId}/dashboard`
          )
        }
        next()
      },
    ],
    children: [
      {
        path: ':ogKey',
        name: 'OgWrapper',
        component: () => import('@/views/PassThrough.vue'),
        beforeEnter: async (to, from, next) => {
          const [ogType, ogId] = to.params.ogKey.split('-')
          if (Number(ogType) === OgType.GROUP) {
            await store.dispatch('group/getGroup', {
              groupId: Number(ogId),
            })
            await store.dispatch('group/groupUser/getGroupUser')
          }
          next()
        },
        children: [
          {
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/innerApp/Dashboard.vue'),
          },
          {
            path: 'management/:tab(about|members|history|dashboard)',
            name: 'Management',
            component: () => import('@/views/innerApp/Management.vue'),
            props: true,
          },
          {
            path: 'progress/:tab(material|u3m|excel|spreadsheet)',
            name: 'Progress',
            component: () => import('@/views/innerApp/Progress.vue'),
            props: true,
          },
          {
            path: 'progress/spreadsheet/:progressId',
            name: 'SpreadsheetProgress',
            component: () =>
              import(
                '@/views/innerApp/assets/AssetsMaterialSpreadsheetRevision.vue'
              ),
            props: true,
          },
          // Assets
          {
            path: 'assets',
            name: 'Assets',
            component: () => import('@/views/innerApp/assets/Assets.vue'),
          },
          {
            path: 'assets/upload',
            name: 'AssetsUpload',
            component: () => import('@/views/innerApp/assets/AssetsUpload.vue'),
          },
          {
            path: 'assets/create',
            name: 'AssetsCreate',
            meta: { nextVer: true },
            component: () => import('@/views/innerApp/assets/AssetsCreate.vue'),
          },
          {
            path: 'assets/upload/manual',
            name: 'AssetsMaterialCreate',
            component: () =>
              import('@/views/innerApp/assets/AssetsMaterialCreate.vue'),
          },
          {
            path: 'assets/:materialId',
            name: 'AssetsMaterialDetail',
            component: () =>
              import('@/views/innerApp/assets/AssetsMaterialDetail.vue'),
            props: true,
          },
          {
            path: 'assets/:materialId/edit',
            name: 'AssetsMaterialEdit',
            component: () =>
              import('@/views/innerApp/assets/AssetsMaterialEdit.vue'),
            props: true,
          },
          {
            path: 'assets/edit/spreadsheet',
            name: 'AssetsMaterialSpreadsheetEdit',
            component: () =>
              import('@/views/innerApp/assets/AssetsMaterialSpreadsheet.vue'),
            props: true,
          },
          // Workspace
          {
            path: 'workspace/:nodeId',
            name: 'Workspace',
            props: true,
            component: () => import('@/views/innerApp/workspace/Workspace.vue'),
          },
          {
            path: 'workspace/material/:nodeId',
            name: 'WorkspaceMaterialDetail',
            props: true,
            component: () =>
              import('@/views/innerApp/workspace/WorkspaceMaterialDetail.vue'),
          },
          {
            path: 'share-with-me/:sharingId?/:nodeId?',
            name: 'ShareWithMe',
            props: true,
            component: () =>
              import('@/views/innerApp/workspace/ShareWithMe.vue'),
          },
          {
            path: 'share-with-me/:sharingId/material/:nodeId',
            name: 'ShareWithMeMaterial',
            props: true,
            component: () =>
              import(
                '@/views/innerApp/workspace/ShareWithMeMaterialDetail.vue'
              ),
          },
          {
            path: 'meta-fabric/:sharingId?/:nodeId?',
            name: 'MetaFabric',
            props: true,
            component: () =>
              import('@/views/innerApp/workspace/MetaFabric.vue'),
          },
          {
            path: 'meta-fabric/:sharingId/material/:nodeId',
            name: 'MetaFabricMaterialDetail',
            props: true,
            component: () =>
              import('@/views/innerApp/workspace/MetaFabricMaterialDetail.vue'),
          },
          {
            path: 'moodboard',
            name: 'Moodboard',
            component: () => import('@/views/innerApp/moodboard/Moodboard.vue'),
            beforeEnter: async (to, from, next) => {
              const organization = await store.getters[
                'organization/organization'
              ]

              console.log('dan', store.getters['permission/enablemoodboardOrg'])
              if (!store.getters['permission/enablemoodboardOrg']) {
                return next(
                  `/${organization.orgNo}/${OgType.ORG}-${organization.orgId}/assets`
                )
              }
              next()
            },
          },
          {
            path: 'moodboard/:moodboardId/:tab(offer|members|picked|comment)',
            name: 'MoodboardDetail',
            props: true,
            component: () =>
              import('@/views/innerApp/moodboard/MoodboardDetail.vue'),
          },
          {
            path: 'moodboard/:moodboardId/picked-list',
            name: 'MoodboardPickedList',
            props: true,
            component: () =>
              import('@/views/innerApp/moodboard/MoodboardPickedList.vue'),
          },
          {
            path: 'thread-board',
            name: 'ThreadBoard',
            props: true,
            component: () => import('@/views/innerApp/ThreadBoard.vue'),
            beforeEnter: async (to, from, next) => {
              const organization = await store.getters[
                'organization/organization'
              ]

              if (!store.getters['permission/enablethreadboardOrg']) {
                return next(
                  `/${organization.orgNo}/${OgType.ORG}-${organization.orgId}/assets`
                )
              }
              next()
            },
          },
        ],
      },
      {
        path: 'billings/:tab(plan|value-added-service|payment|history)',
        name: 'Billings',
        props: true,
        component: () => import('@/views/innerApp/Billings.vue'),
      },
      {
        path: 'public-library/:nodeId?',
        name: 'PublicLibrary',
        props: true,
        component: () => import('@/views/innerApp/PublicLibrary.vue'),
        beforeEach: async (to, from, next) => {
          const organization = await store.getters['organization/organization']
          // 特殊客戶不給看 sourcing library 導去 dashborad
          if (
            store.getters['permission/isLittleKingRule'] ||
            store.getters['permission/isFabriSelectAccount']
          ) {
            return next(
              `/${organization.orgNo}/${OgType.ORG}-${organization.orgId}/dashboard`
            )
          }
          if (store.getters['permission/isFabriSelectAccount']) {
            return next(
              `/${organization.orgNo}/${OgType.ORG}-${organization.orgId}/dashboard`
            )
          }
          next()
        },
      },
      {
        path: 'public-library/material/:nodeId',
        name: 'PublicLibraryMaterialDetail',
        props: true,
        component: () =>
          import('@/views/innerApp/PublicLibraryMaterialDetail.vue'),
      },
      {
        path: 'showroom/:showroomId/:nodeId?',
        name: 'Showroom',
        props: true,
        component: () => import('@/views/innerApp/Showroom.vue'),
      },
      {
        path: 'showroom/:showroomId/material/:nodeId',
        name: 'ShowroomMaterialDetail',
        props: true,
        component: () => import('@/views/innerApp/ShowroomMaterialDetail.vue'),
      },
    ],
  },
  {
    path: '/',
    name: 'OuterAppRoot',
    props: true,
    component: () => import('@/views/outerApp/OuterApp.vue'),
    children: [
      {
        path: 'received-share/:sharingKey/navigator',
        name: 'ReceivedShareNavigator',
        props: true,
        meta: { outerType: OUTER_TYPE.RECEIVED_SHARE },
        component: () =>
          import('@/views/outerApp/receivedShare/ReceivedShareNavigator.vue'),
      },
      {
        path: 'received-share/:sharingKey/:nodeId',
        name: 'ReceivedShareCollection',
        props: true,
        meta: { outerType: OUTER_TYPE.RECEIVED_SHARE },
        components: {
          default: () =>
            import(
              '@/views/outerApp/receivedShare/ReceivedShareCollection.vue'
            ),
          header: () => import('@/components/outerApp/ReceivedShareHeader.vue'),
        },
      },
      {
        path: 'received-share/:sharingKey/material/:nodeId',
        name: 'ReceivedShareMaterial',
        props: true,
        meta: { outerType: OUTER_TYPE.RECEIVED_SHARE },
        components: {
          default: () =>
            import(
              '@/views/outerApp/receivedShare/ReceivedShareMaterialDetail.vue'
            ),
          header: () => import('@/components/outerApp/ReceivedShareHeader.vue'),
        },
      },
      {
        path: 'embed/:sharingKey/:nodeId',
        name: 'EmbedCollection',
        props: true,
        meta: { outerType: OUTER_TYPE.EMBED },
        component: () => import('@/views/outerApp/embed/Embed.vue'),
      },
      {
        path: 'embed/:sharingKey/material/:nodeId',
        name: 'EmbedMaterialDetail',
        props: true,
        meta: { outerType: OUTER_TYPE.EMBED },
        component: () =>
          import('@/views/outerApp/embed/EmbedMaterialDetail.vue'),
      },
      {
        path: 'assets/:frontierNo',
        name: 'OuterAssetsMaterialDetail',
        props: true,
        meta: { outerType: OUTER_TYPE.ASSETS },
        components: {
          default: () =>
            import('@/views/outerApp/assets/OuterAssetsMaterialDetail.vue'),
          header: () => import('@/components/outerApp/OuterAssetsHeader.vue'),
        },
      },
    ],
  },

  // 404 case
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    beforeEnter: async (_to, _from, next) => {
      await store.dispatch('user/getUser')
      next()
    },
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  sensitive: true,
})

router.afterEach((to) => {
  let pageTitle = to.name
  if (to.params.ogKey) {
    const [ogType] = to.params.ogKey.split('-')
    pageTitle = `${Number(ogType) === OgType.ORG ? 'Org' : 'Group'}${to.name}`
  }
  pageview({
    page_title: pageTitle,
    page_path: to.path,
    page_location: to.href,
  })
})

export default router

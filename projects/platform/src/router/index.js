import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { useNotifyStore } from '@/stores/notify'
import useLogSender from '@/composables/useLogSender'
import { ROLE_ID, NODE_TYPE } from '@/utils/constants'
import i18n from '@frontier/i18n'
import remindVerifyEmail from '@/utils/remind-verify-email'
import { pageview } from 'vue-gtag'
import { OgType } from '@frontier/platform-web-sdk'
import { config } from 'vue-gtag'

const checkUserIsVerify = (to, from, next) => {
  const user = store.getters['user/user']
  if (!user.isVerify) {
    remindVerifyEmail()
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
      window.location.replace('https://frontier.cool/')
    },
  },
  {
    path: '/share-page',
    name: 'SharePage',
    beforeEnter: async (to, from, next) => {
      const { sharingKey } = to.query
      await store.dispatch('receivedShare/getShareReceivedInfo', { sharingKey })
      const share = store.getters['receivedShare/share']
      const logSender = useLogSender()
      logSender.createReceivePageLog(sharingKey)
      const nodeKey = `${share.workspaceNodeLocation}-${share.workspaceNodeId}`
      if (share.workspaceNodeType === NODE_TYPE.COLLECTION) {
        next(`/received-share/${sharingKey}/${nodeKey}`)
      } else {
        next(`/received-share/${sharingKey}/material/${nodeKey}`)
      }
    },
  },
  {
    path: '/received-share/:sharingKey',
    name: 'ReceivedShare',
    component: () =>
      import('@/views/outerApp/receivedShare/ReceivedShareContainer.vue'),
    beforeEnter: async (to, from, next) => {
      const sharingKey = to.params.sharingKey
      await Promise.all([
        store.dispatch('receivedShare/checkHasLogin'),
        store.dispatch('receivedShare/getShareReceivedInfo', { sharingKey }),
      ])
      if (store.getters['receivedShare/hasLogin']) {
        await store.dispatch('user/getUser')
      }
      next()
    },
    children: [
      {
        path: ':nodeKey',
        name: 'ReceivedShareCollection',
        props: true,
        component: () =>
          import('@/views/outerApp/receivedShare/ReceivedShareCollection.vue'),
      },
      {
        path: 'material/:nodeKey',
        name: 'ReceivedShareMaterial',
        props: true,
        component: () =>
          import('@/views/outerApp/receivedShare/ReceivedShareMaterial.vue'),
      },
    ],
  },
  {
    path: '/embed/:sharingKey',
    name: 'Embed',
    component: () => import('@/views/outerApp/embed/EmbedContainer.vue'),
    beforeEnter: async (to, from, next) => {
      const sharingKey = to.params.sharingKey
      await store.dispatch('embed/getEmbedInfo', { sharingKey })
      const logSender = useLogSender()
      logSender.createEmbedPageLog(sharingKey)
      next()
    },
    children: [
      {
        path: ':nodeKey',
        name: 'EmbedCollection',
        props: true,
        component: () => import('@/views/outerApp/embed/Embed.vue'),
      },
      {
        path: 'material/:nodeKey',
        name: 'EmbedMaterialDetail',
        props: true,
        component: () =>
          import('@/views/outerApp/embed/EmbedMaterialDetail.vue'),
      },
    ],
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
          'showroom/getShowroomBannerAndList',
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
            path: 'billings/:tab(plan|value-added-service|payment|history)',
            name: 'Billings',
            props: true,
            component: () => import('@/views/innerApp/Billings.vue'),
          },
          {
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/innerApp/Dashboard.vue'),
          },
          {
            path: 'management/:tab(about|members|history|dashboard)',
            name: 'Management',
            component: () => import('@/views/innerApp/Management.vue'),
          },
          {
            path: 'progress/:tab(material|u3m|excel)',
            name: 'Progress',
            component: () => import('@/views/innerApp/Progress.vue'),
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
          // Workspace
          {
            path: 'workspace/:nodeId',
            name: 'Workspace',
            props: true,
            component: () => import('@/views/innerApp/Workspace.vue'),
          },
          {
            path: 'workspace/material/:nodeId',
            name: 'WorkspaceMaterialDetail',
            props: true,
            component: () =>
              import('@/views/innerApp/WorkspaceMaterialDetail.vue'),
          },
          {
            path: 'share-to-me/:nodeKey?',
            name: 'ShareToMe',
            props: true,
            component: () => import('@/views/innerApp/ShareToMe.vue'),
          },
          {
            path: 'share-to-me/material/:nodeKey',
            name: 'ShareToMeMaterial',
            props: true,
            component: () =>
              import('@/views/innerApp/ShareToMeMaterialDetail.vue'),
          },
          {
            path: 'moodboard',
            name: 'Moodboard',
            component: () => import('@/views/innerApp/moodboard/Moodboard.vue'),
          },
          {
            path: 'moodboard/:moodboardId',
            name: 'MoodboardDetail',
            props: (route) => {
              const moodboardId = Number.parseInt(route.params.moodboardId, 10)
              if (Number.isNaN(moodboardId)) {
                return 0
              }
              return { moodboardId }
            },
            component: () =>
              import('@/views/innerApp/moodboard/MoodboardDetail.vue'),
          },
          {
            path: 'moodboard/:moodboardId/picked-list',
            name: 'MoodboardPickedList',
            component: () =>
              import('@/views/innerApp/moodboard/MoodboardPickedList.vue'),
            beforeEnter: async (to, from, next) => {
              const moodboardId = Number.parseInt(to.params.moodboardId, 10)
              await store.dispatch('moodboard/getMoodboard', { moodboardId })
              next()
            },
          },
          {
            path: 'thread-board',
            name: 'ThreadBoard',
            props: true,
            component: () => import('@/views/innerApp/ThreadBoard.vue'),
          },
        ],
      },
      {
        path: 'public-library/:nodeKey?',
        name: 'PublicLibrary',
        props: true,
        component: () => import('@/views/innerApp/PublicLibrary.vue'),
      },
      {
        path: 'public-library/material/:nodeKey',
        name: 'PublicLibraryMaterialDetail',
        props: true,
        component: () =>
          import('@/views/innerApp/PublicLibraryMaterialDetail.vue'),
      },
      {
        path: 'showroom/:showroomId/:nodeKey?',
        name: 'Showroom',
        props: true,
        component: () => import('@/views/innerApp/Showroom.vue'),
      },
      {
        path: 'showroom/:showroomId/material/:nodeKey',
        name: 'ShowroomMaterialDetail',
        props: true,
        component: () => import('@/views/innerApp/ShowroomMaterialDetail.vue'),
      },
    ],
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

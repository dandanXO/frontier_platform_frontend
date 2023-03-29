import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { ROLE_ID, NODE_TYPE } from '@/utils/constants'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import i18n from '@/utils/i18n'
import remindVerifyEmail from '@/utils/remind-verify-email'

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

const reuseRoutes = (prefix) => [
  {
    path: 'management/:tab(about|members|history)',
    name: `${prefix}Management`,
    component: () => import('@/views/innerApp/Management.vue'),
  },
  {
    path: 'progress/:tab(material|u3m|excel)',
    name: `${prefix}Progress`,
    component: () => import('@/views/innerApp/Progress.vue'),
  },
  {
    path: 'assets',
    component: () => import('@/views/PassThrough.vue'),
    children: [
      {
        path: '',
        name: `${prefix}Assets`,
        component: () => import('@/views/innerApp/assets/Assets.vue'),
      },
      {
        path: 'upload',
        name: `${prefix}AssetsUpload`,
        component: () => import('@/views/innerApp/assets/AssetsUpload.vue'),
      },
      {
        path: 'upload/manual',
        name: `${prefix}AssetsMaterialCreate`,
        component: () =>
          import('@/views/innerApp/assets/AssetsMaterialCreate.vue'),
      },
      {
        path: ':materialId',
        name: `${prefix}AssetsMaterialDetail`,
        component: () =>
          import('@/views/innerApp/assets/AssetsMaterialDetail.vue'),
      },
      {
        path: ':materialId/edit',
        name: `${prefix}AssetsMaterialEdit`,
        component: () =>
          import('@/views/innerApp/assets/AssetsMaterialEdit.vue'),
        props: true,
      },
    ],
  },
  {
    path: 'workspace/:nodeKey',
    name: `${prefix}Workspace`,
    props: true,
    component: () => import('@/views/innerApp/Workspace.vue'),
  },
  {
    path: 'workspace/material/:nodeKey',
    name: `${prefix}WorkspaceMaterialDetail`,
    props: true,
    component: () => import('@/views/innerApp/WorkspaceMaterialDetail.vue'),
  },
  {
    path: 'share-to-me/:nodeKey?',
    name: `${prefix}ShareToMe`,
    props: true,
    component: () => import('@/views/innerApp/ShareToMe.vue'),
  },
  {
    path: 'share-to-me/material/:nodeKey',
    name: `${prefix}ShareToMeMaterial`,
    props: true,
    component: () => import('@/views/innerApp/ShareToMeMaterialDetail.vue'),
  },
  {
    path: 'moodboard',
    name: `${prefix}Moodboard`,
    component: () => import('@/views/innerApp/moodboard/Moodboard.vue'),
  },
  {
    path: 'moodboard/:moodboardId',
    name: `${prefix}MoodboardDetail`,
    props: (route) => {
      const moodboardId = Number.parseInt(route.params.moodboardId, 10)
      if (Number.isNaN(moodboardId)) {
        return 0
      }
      return { moodboardId }
    },
    component: () => import('@/views/innerApp/moodboard/MoodboardDetail.vue'),
  },
  {
    path: 'moodboard/:moodboardId/picked-list',
    name: `${prefix}MoodboardPickedList`,
    component: () =>
      import('@/views/innerApp/moodboard/MoodboardPickedList.vue'),
    beforeEnter: async (to, from, next) => {
      const moodboardId = Number.parseInt(to.params.moodboardId, 10)
      await store.dispatch('moodboard/getMoodboard', { moodboardId })
      next()
    },
  },
  {
    path: 'sticker',
    name: `${prefix}Sticker`,
    component: () => import('@/views/innerApp/Sticker.vue'),
  },
]

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
      window.location.replace('https://frontier.cool/')
    },
  },
  {
    path: '/share-page',
    name: 'SharePage',
    beforeEnter: async (to, from, next) => {
      const { sharingKey } = to.query
      store.dispatch('code/getFilterOptions')
      await store.dispatch('receivedShare/getShareReceivedInfo', { sharingKey })
      const share = store.getters['receivedShare/share']
      store.dispatch('dashboard/createReceivePageLog', { sharingKey })
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
    component: () => import('@/views/receivedShare/ReceivedShareContainer.vue'),
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
          import('@/views/receivedShare/ReceivedShareCollection.vue'),
      },
      {
        path: 'material/:nodeKey',
        name: 'ReceivedShareMaterial',
        props: true,
        component: () =>
          import('@/views/receivedShare/ReceivedShareMaterial.vue'),
      },
    ],
  },
  {
    path: '/embed/:sharingKey',
    name: 'Embed',
    component: () => import('@/views/embed/EmbedContainer.vue'),
    beforeEnter: async (to, from, next) => {
      const sharingKey = to.params.sharingKey
      await store.dispatch('embed/getEmbedInfo', { sharingKey })
      store.dispatch('dashboard/createEmbedPageLog', { sharingKey })
      next()
    },
    children: [
      {
        path: ':nodeKey',
        name: 'EmbedCollection',
        props: true,
        component: () => import('@/views/embed/Embed.vue'),
      },
      {
        path: 'material/:nodeKey',
        name: 'EmbedMaterialDetail',
        props: true,
        component: () => import('@/views/embed/EmbedMaterialDetail.vue'),
      },
    ],
  },
  {
    path: '/embed-3d-viewer/:materialId',
    name: 'Embed3DViewer',
    component: () => import('@/views/embed3DViewer/Embed3DViewer.vue'),
  },
  {
    path: '/',
    name: 'AppRoot',
    component: () => import('@/views/innerApp/InnerAppLayout.vue'),
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
        component: () => import('@/views/PassThrough.vue'),
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
          await store.dispatch('user/getUser')
          return next(`/${orgNo}`)
        },
      },
      {
        path: 'verify-user',
        name: 'VerifyUser',
        beforeEnter: async (to, from, next) => {
          const { verifyCode } = to.query
          await store.dispatch('user/verifyUser', { verifyCode })
          await next('/')
          store.dispatch('helper/pushFlashMessage', i18n.global.t('AA0086'))
        },
      },
      {
        path: 'moodboard/:sharingKey',
        name: 'MoodboardReceivedShare',
        component: () => import('@/views/MoodboardReceivedShare.vue'),
        beforeEnter: checkUserIsVerify,
      },
      {
        path: ':orgNo',
        name: 'InnerAppRoot',
        components: {
          default: () => import('@/views/PassThrough.vue'),
          sidebar: Sidebar,
        },
        beforeEnter: [
          checkUserIsVerify,
          async (to, from, next) => {
            await store.dispatch('organization/getOrg', {
              orgNo: to.params.orgNo,
            })

            const apiList = [
              'organization/orgUser/getOrgUser',
              'organization/getPricing',
              'showroom/getShowroomAnnouncement',
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
            if (
              orgUser.orgRoleId === ROLE_ID.OWNER &&
              !org.uploadMaterialEmail
            ) {
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
            path: '',
            name: 'OrgRoot',
            component: () => import('@/views/PassThrough.vue'),
            beforeEnter: [checkOrgIsInactive],
            children: [
              ...reuseRoutes('Org'),
              {
                path: 'billings/:tab(plan|value-added-service|payment|history)',
                name: 'Billings',
                props: true,
                component: () => import('@/views/innerApp/Billings.vue'),
                // beforeEnter: (to, from, next) => {
                //   const roleId = store.getters['organization/orgUser/orgUser'].orgRoleId
                //   if ([ROLE_ID.OWNER, ROLE_ID.ADMIN].includes(roleId)) {
                //     return next()
                //   } else {
                //     return next(`/${to.params.orgNo}/public-library`)
                //   }
                // }
              },
            ],
          },
          {
            path: ':groupId(\\d+)',
            name: 'GroupRoot',
            component: () => import('@/views/PassThrough.vue'),
            beforeEnter: [
              checkOrgIsInactive,
              async (to, from, next) => {
                await store.dispatch('group/getGroup', {
                  groupId: to.params.groupId,
                })
                await store.dispatch('group/groupUser/getGroupUser')
                next()
              },
            ],
            children: reuseRoutes('Group'),
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
            beforeEnter: checkOrgIsInactive,
          },
          {
            path: 'showroom/:showroomId/:nodeKey?',
            name: 'Showroom',
            props: true,
            component: () => import('@/views/innerApp/Showroom.vue'),
            beforeEnter: checkOrgIsInactive,
          },
          {
            path: 'showroom/:showroomId/material/:nodeKey',
            name: 'ShowroomMaterialDetail',
            props: true,
            component: () =>
              import('@/views/innerApp/ShowroomMaterialDetail.vue'),
            beforeEnter: checkOrgIsInactive,
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  sensitive: true,
})

export default router

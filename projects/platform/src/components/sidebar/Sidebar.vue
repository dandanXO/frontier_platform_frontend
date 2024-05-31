<template lang="pug">
div(class="relative z-sidebar min-w-60 w-60 h-full bg-grey-50 shadow-16 flex flex-col")
  menu-org
  div(class="border-t border-grey-150 px-1 py-1.5 flex flex-col" v-if="showPublicLibrary")
    div(class="grid gap-y-1.5")
      sidebar-item#PublicLibrary(:goTo="goToPublicLibrary")
        img(src="@/assets/images/logo.png" class="w-5 h-5")
        p(class="text-body2 text-grey-900 line-clamp-1") {{ $t('RR0003') }}
  div(class="flex-grow px-1 flex flex-col")
    div(class="w-auto h-px bg-grey-150 mx-1.5 my-1.5")
    f-scrollbar-container(class="flex-grow")
      div(class="grid gap-y-1.5")
        sidebar-item#Dashboard(
          :title="$t('BB0138')"
          :goTo="goToDashboard"
          icon="dashboard"
          :disabled="planStatus.INACTIVE"
        )
        sidebar-item#Management(
          :title="$t('RR0004')"
          :goTo="goToManagement"
          icon="member_setting"
          :disabled="planStatus.INACTIVE"
          data-cy="sidebar_management"
        )
        sidebar-item#Progress(:goTo="goToProgress")
          f-svg-icon(
            iconName="progress"
            size="20"
            :class="[planStatus.INACTIVE ? 'text-grey-250' : 'text-grey-600']"
          )
          span(
            class="text-body2 line-clamp-1 flex-grow"
            :class="[planStatus.INACTIVE ? 'text-grey-250' : 'text-grey-900']"
          ) {{ $t('PP0001') }}
          div(
            v-if="isProcessing"
            class="h-6 w-6.5 flex justify-center items-center rounded mr-2"
          )
            f-svg-icon(iconName="loading" size="20" class="text-primary-400")
        f-expansion-panel(
          v-for="og in ogList"
          :key="og.ogId"
          :class="[{ 'pointer-events-none': og.disabled }]"
          data-cy="sidebar_location"
        )
          template(#trigger="{ isExpand }")
            div(class="flex items-center h-9 pl-4 pr-5 hover:bg-grey-100")
              label(
                class="w-3 h-3 rounded-sm mr-3"
                :style="{ backgroundColor: og.disabled ? '#c4c4c4' : og.labelColor }"
              )
              span(
                class="flex-grow text-body2 line-clamp-1"
                :class="[og.disabled ? 'text-grey-250' : 'text-grey-900']"
              ) {{ og.name }}
              f-svg-icon(
                iconName="keyboard_arrow_right"
                size="24"
                class="transform"
                :class="[isExpand ? 'rotate-90' : 'rotate-0', og.disabled ? 'text-grey-250' : 'text-grey-600']"
              )
          template(#content)
            div(class="flex flex-col gap-y-0.5")
              sidebar-item(
                v-for="(menu, index) in ogSideItemList(og.ogType, og.ogId, og.nodeId)"
                :key="menu.id"
                :ogKey="`${og.ogType}-${og.ogId}`"
                v-bind="menu"
                class="relative flex justify-between"
                :style="{ zIndex: 20 - index }"
              )
                p(class="pl-7 text-body2 text-grey-900 line-clamp-1") {{ menu.title }}
                template(v-if="menu.id === 'Assets'")
                  f-tooltip-standard(class="mr-3" :tooltipMessage="$t('RR0012')")
                    template(#slot:tooltip-trigger)
                      div(
                        class="flex justify-center items-center w-6 h-6 rounded bg-grey-100"
                        data-cy="upload-page"
                        @click.stop="goToMaterialUpload({ orgNo: organization.orgNo, ogKey: `${og.ogType}-${og.ogId}` })"
                      )
                        f-svg-icon(
                          :iconName="'upload'"
                          size="20"
                          class="text-grey-600"
                        )
      div(class="w-auto h-px bg-grey-100 mx-1.5 my-1.5")
    div(
      v-if="isPromotingNewFeature"
      class="mx-auto my-3.5 bg-grey-0 shadow-2 rounded"
      @click="store.dispatch('user/openModalNewFeatureLaunch')"
    )
      f-button(type="secondary" size="md" prependIcon="new") {{ $t('TT0127') }}
  menu-org-user
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { computed, onUnmounted } from 'vue'
import SidebarItem from '@/components/sidebar/SidebarItem.vue'
import MenuOrg from '@/components/sidebar/MenuOrg.vue'
import MenuOrgUser from '@/components/sidebar/MenuOrgUser.vue'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { OgType, type Organization } from '@frontier/platform-web-sdk'

const { t } = useI18n()
const store = useStore()
const {
  goToPublicLibrary,
  goToDashboard,
  goToManagement,
  goToProgress,
  goToAssets,
  goToWorkspace,
  goToMoodboard,
  goToThreadBoard,
  goToMaterialUpload,
} = useNavigation()

const isPromotingNewFeature = computed(
  () => store.getters['user/isPromotingNewFeature']
)
const organization = computed<Organization>(
  () => store.getters['organization/organization']
)
const showPublicLibrary = computed(
  () => store.getters['permission/littlekingRule']
)
const isProcessing = computed(() => store.getters['polling/isProcessing'])
const planStatus = computed(() => store.getters['polling/planStatus'])
const ogList = computed(() => {
  const { orgId, orgName, labelColor, nodeId } = organization.value
  return [
    {
      ogType: OgType.ORG,
      ogId: orgId,
      nodeId,
      name: orgName,
      labelColor: labelColor,
      disabled: planStatus.value.INACTIVE as boolean,
    },
    ...organization.value.groupList.map((group) => {
      const { groupId, groupName, labelColor, nodeId } = group
      return {
        ogType: OgType.GROUP,
        ogId: groupId,
        nodeId,
        name: groupName,
        labelColor: labelColor,
        disabled: planStatus.value.INACTIVE as boolean,
      }
    }),
  ] as {
    ogType: OgType
    ogId: number
    nodeId: number
    name: string
    labelColor: string
    disabled: boolean
  }[]
})
const ogSideItemList = (ogType: OgType, ogId: number, nodeId: number) => {
  const navReq = {
    orgNo: organization.value.orgNo,
    ogKey: `${ogType}-${ogId}`,
  }
  return [
    {
      id: 'Assets',
      title: t('RR0008'),
      goTo: goToAssets.bind(null, navReq),
    },
    {
      id: 'Workspace',
      title: t('RR0009'),
      goTo: goToWorkspace.bind(null, navReq, nodeId),
    },
    {
      id: 'Moodboard',
      title: t('QQ0001'),
      goTo: goToMoodboard.bind(null, navReq),
    },
    {
      id: 'ThreadBoard',
      title: t('TT0132'),
      goTo: goToThreadBoard.bind(null, navReq),
    },
  ]
}
onUnmounted(() => {
  store.dispatch('polling/stopPollingSidebar')
})
</script>

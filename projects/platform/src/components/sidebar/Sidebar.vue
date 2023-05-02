<template lang="pug">
div(class="relative z-sidebar min-w-60 w-60 h-full bg-grey-50 shadow-16 flex flex-col")
  menu-org
  div(class="border-t border-grey-150 px-1 py-1.5 flex flex-col")
    div(class="grid gap-y-1.5")
      sidebar-item#publicLibrary(
        :path="`/${organization.orgNo}/public-library`"
      )
        img(src="@/assets/images/logo.png" class="w-5 h-5")
        p(class="text-body2 text-grey-900 line-clamp-1") {{ $t('RR0003') }}
  div(class="flex-grow px-1 flex flex-col")
    div(class="w-auto h-px bg-grey-150 mx-1.5 my-1.5")
    f-scrollbar-container(class="flex-grow")
      div(class="grid gap-y-1.5")
        sidebar-item#management(
          :title="$t('RR0004')"
          :path="`/${organization.orgNo}/management/about`"
          icon="member_setting"
          :disabled="planStatus.INACTIVE"
          data-cy="sidebar_management"
        )
        sidebar-item#progress(
          :path="`/${organization.orgNo}/progress/material`"
        )
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
          v-for="item in menuOrgOrGroup"
          :class="[{ 'pointer-events-none': item.disabled }]"
          data-cy="sidebar_location"
        )
          template(#trigger="{ isExpand }")
            div(class="flex items-center h-9 pl-4 pr-5 hover:bg-grey-100")
              label(
                class="w-3 h-3 rounded-sm mr-3"
                :style="{ backgroundColor: item.disabled ? '#c4c4c4' : item.labelColor }"
              )
              span(
                class="flex-grow text-body2 line-clamp-1"
                :class="[item.disabled ? 'text-grey-250' : 'text-grey-900']"
              ) {{ item.name }}
              f-svg-icon(
                iconName="keyboard_arrow_right"
                size="24"
                class="transform"
                :class="[isExpand ? 'rotate-90' : 'rotate-0', item.disabled ? 'text-grey-250' : 'text-grey-600']"
              )
          template(#content)
            div(class="flex flex-col gap-y-0.5")
              sidebar-item(
                v-for="(menu, index) in item.menuList"
                v-bind="menu"
                class="relative flex justify-between"
                :style="{ zIndex: 20 - index }"
              )
                p(class="pl-7 text-body2 text-grey-900 line-clamp-1") {{ menu.title }}
                template(v-if="menu.id === 'assets'")
                  f-tooltip(class="mr-3")
                    template(#trigger)
                      div(
                        class="flex justify-center items-center w-6 h-6 rounded bg-grey-100"
                        data-cy="upload-page"
                        @click.stop="goToAssetsUpload(menu.path)"
                      )
                        f-svg-icon(
                          :iconName="menu.icon"
                          size="20"
                          class="text-grey-600"
                        )
                    template(#content)
                      p {{ $t('RR0012') }}
      div(class="w-auto h-px bg-grey-100 mx-1.5 my-1.5")
    div(
      v-if="isPromotingNewFeature"
      class="mx-auto my-3.5 bg-grey-0 shadow-2 rounded"
      @click="store.dispatch('user/openModalNewFeatureReminder')"
    )
      f-button(type="secondary" size="md" prependIcon="new") {{ $t('TT0127') }}
  menu-org-user
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, onUnmounted } from 'vue'
import SidebarItem from '@/components/sidebar/SidebarItem.vue'
import MenuOrg from '@/components/sidebar/MenuOrg.vue'
import MenuOrgUser from '@/components/sidebar/MenuOrgUser.vue'
import { useI18n } from 'vue-i18n'
import { OG_TYPE } from '@/utils/constants'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const isPromotingNewFeature = computed(
  () => store.getters['user/isPromotingNewFeature']
)
const organization = computed(() => store.getters['organization/organization'])
const isProcessing = computed(() => store.getters['polling/isProcessing'])
const planStatus = computed(() => store.getters['polling/planStatus'])
const menuOrgOrGroup = computed(() => {
  const { orgId, orgNo, orgName, labelColor, workspaceNodeId } =
    organization.value
  return [
    {
      id: orgId,
      name: orgName,
      labelColor: labelColor,
      disabled: planStatus.value.INACTIVE,
      menuList: [
        {
          id: 'assets',
          title: t('RR0008'),
          path: `/${orgNo}/assets`,
          icon: 'upload',
        },
        {
          id: 'workspace',
          title: t('RR0009'),
          path: `/${orgNo}/workspace/${OG_TYPE.ORG}-${workspaceNodeId}`,
          pathUseToMatch: `/${orgNo}/workspace`,
        },
        {
          id: 'moodboard',
          title: t('QQ0001'),
          path: `/${orgNo}/moodboard`,
        },
        {
          id: 'shareToMe',
          title: t('RR0010'),
          path: `/${orgNo}/share-to-me`,
        },
      ],
    },
    ...store.getters['organization/groupList'].map((group) => {
      const { groupId, groupName, labelColor, workspaceNodeId } = group
      return {
        id: groupId,
        name: groupName,
        labelColor: labelColor,
        disabled: planStatus.value.INACTIVE,
        menuList: [
          {
            id: 'assets',
            title: t('RR0008'),
            path: `/${orgNo}/${groupId}/assets`,
            icon: 'upload',
          },
          {
            id: 'workspace',
            title: t('RR0009'),
            path: `/${orgNo}/${groupId}/workspace/${OG_TYPE.GROUP}-${workspaceNodeId}`,
            pathUseToMatch: `/${orgNo}/${groupId}/workspace`,
          },
          {
            id: 'moodboard',
            title: t('QQ0001'),
            path: `/${orgNo}/${groupId}/moodboard`,
          },
          {
            id: 'shareToMe',
            title: t('RR0010'),
            path: `/${orgNo}/${groupId}/share-to-me`,
          },
        ],
      }
    }),
  ]
})

onUnmounted(() => {
  store.dispatch('polling/stopPollingSidebar')
})

const goToAssetsUpload = async (path) => {
  await store.dispatch('sticker/closeStickerDrawer')
  router.push(path + '/upload')
}
</script>

<style lang="scss" scoped>
.sidebar-shadow {
  filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25));
}
</style>

<template lang="pug">
div(class="relative z-sidebar min-w-60 w-60 h-full bg-black-100 sidebar-shadow flex flex-col")
  menu-org
  div(class="border-t border-primary-thin px-1 py-1.5 flex flex-col")
    div(class="grid gap-y-1.5")
      sidebar-item( id="publicLibrary" :path="`/${organization.orgNo}/public-library`")
        img(src="@/assets/images/logo.png" class="w-5 h-5")
        p(class="text-body2 text-primary line-clamp-1") {{ $t("RR0003") }}
  div(class="flex-grow px-1 flex flex-col")
    div(class="w-auto h-px bg-primary-thin mx-1.5 my-1.5")
    overlay-scrollbar-container(class="flex-grow")
      div(class="grid gap-y-1.5")
        sidebar-item(
          id="management"
          :title="$t('RR0004')"
          :path="`/${organization.orgNo}/management/about`"
          icon="member_setting"
          :disabled="planStatus.INACTIVE"
        )
        sidebar-item(
          id="progress"
          :path="`/${organization.orgNo}/progress/material`"
        )
          svg-icon(iconName="progress" size="20" :class="[planStatus.INACTIVE ? 'text-black-500' : 'text-black-700']")
          span(class="text-body2 line-clamp-1 flex-grow" :class="[planStatus.INACTIVE ? 'text-black-500' : 'text-primary']") {{ $t('PP0001') }}
          div(v-if="isProcessing" class="h-6 w-6.5 flex justify-center items-center rounded mr-2")
            svg-icon(iconName="loading" size="20" class="text-brand")
        dropdown(v-for="item in menuOrgOrGroup" :options="item.menuList" :closeAfterSelect="false" :closeAfterOutsideClick="false" :class="[{ 'pointer-events-none': item.disabled }]")
          template(#displayItem="{ isExpand }")
            div(class="flex items-center h-9 pl-4 pr-5 hover:bg-black-400")
              label(class="w-3 h-3 rounded-sm mr-3" :style="{ backgroundColor: item.disabled ? '#c4c4c4' : item.labelColor }")
              span(class="flex-grow text-body2 line-clamp-1" :class="[item.disabled ? 'text-black-500' : 'text-primary']") {{ item.name }}
              svg-icon(iconName="keyboard_arrow_right" size="24" class=" transform" :class="[isExpand ? 'rotate-90' : 'rotate-0', item.disabled ? 'text-black-500' : 'text-black-650']")
          template(#dropdownList="{ options }")
            div(class="flex flex-col gap-y-0.5")
              sidebar-item(v-for="(menu, index) in options" v-bind="menu" class="relative flex justify-between" :style="{ zIndex: 20 - index }")
                p(class="pl-7 text-body2 text-primary line-clamp-1") {{ $t(menu.title) }}
                template(v-if="menu.id === 'assets'")
                  tooltip(placement="bottom" class="mr-3")
                    template(#trigger)
                      div(class="flex justify-center items-center w-6 h-6 rounded bg-primary-thin" @click.stop="$router.push(menu.path + '/upload')")
                        svg-icon(:iconName="menu.icon" size="20" class="text-black-800")
                    template(#content)
                      p(class="text-caption text-primary px-3 py-1") {{ $t("RR0012") }}
      div(class="w-auto h-px bg-primary-thin mx-1.5 my-1.5")
  menu-org-user
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, onUnmounted } from 'vue'
import SidebarItem from '@/components/layout/sidebar/SidebarItem.vue'
import MenuOrg from '@/components/layout/sidebar/MenuOrg.vue'
import MenuOrgUser from '@/components/layout/sidebar/MenuOrgUser.vue'
import { useI18n } from 'vue-i18n'
import { NODE_LOCATION } from '@/utils/constants'

const { t } = useI18n()
const store = useStore()

const organization = computed(() => store.getters['organization/organization'])
const isProcessing = computed(() => store.getters['polling/isProcessing'])
const planStatus = computed(() => store.getters['polling/planStatus'])
const menuOrgOrGroup = computed(() => {
  const { orgId, orgNo, orgName, labelColor, workspaceNodeId } = organization.value
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
          icon: 'upload'
        },
        {
          id: 'workspace',
          title: t('RR0009'),
          path: `/${orgNo}/workspace/${NODE_LOCATION.ORG}-${workspaceNodeId}`
        },
        {
          id: 'moodboard',
          title: t('QQ0001'),
          path: `/${orgNo}/moodboard`
        },
        {
          id: 'shareToMe',
          title: t('RR0010'),
          path: `/${orgNo}/share-to-me`
        }
      ]
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
            icon: 'upload'
          },
          {
            id: 'workspace',
            title: t('RR0009'),
            path: `/${orgNo}/${groupId}/workspace/${NODE_LOCATION.GROUP}-${workspaceNodeId}`
          },
          {
            id: 'moodboard',
            title: t('QQ0001'),
            path: `/${orgNo}/${groupId}/moodboard`
          },
          {
            id: 'shareToMe',
            title: t('RR0010'),
            path: `/${orgNo}/${groupId}/share-to-me`
          }
        ]
      }
    })
  ]
})

onUnmounted(() => {
  store.dispatch('polling/stopPollingSidebar')
})
</script>

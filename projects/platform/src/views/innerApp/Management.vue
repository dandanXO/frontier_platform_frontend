<template lang="pug">
div(class="px-6 pt-6.5 h-full flex flex-col")
  div(class="h-11 flex justify-between items-center mb-12.5")
    f-select-dropdown(
      class="w-75"
      :selectValue="`${ogType}-${ogId}`"
      :dropdownMenuTree="menuOrgOrGroup"
      @update:selectValue="($event) => goToManagement({ ogKey: $event })"
      data-cy="management_select"
    )
    div(class="flex gap-x-6 items-center")
      div(
        v-permission="FUNC_ID.OPEN_CREATE_GROUP"
        class="flex gap-x-1 items-center cursor-pointer"
        @click="openModalCreateGroup"
        data-cy="open-create-group-modal"
      )
        f-svg-icon(iconName="add_box" size="20" class="text-primary-400")
        p(class="text-body2 text-grey-900") {{ $t('UU0017') }}
      f-button(
        size="sm"
        prependIcon="person_add"
        @click="inviteHandler"
        data-cy="open-invite-members-modal"
      ) {{ $t('UU0014') }}
  f-tabs(
    :tabList="tabList"
    :initValue="$route.params.tab"
    @switch="toggleTab($event.path)"
    class="flex-grow pr-3"
  )
    template(#default="{ currentTab }")
      template(v-if="currentTab === 'about'")
        org-about(v-if="ogType === OgType.ORG")
        group-about(v-else :key="ogId")
      member-list(v-else-if="currentTab === 'members'")
      history-list(v-else-if="currentTab === 'history'")
</template>

<script setup lang="ts">
import { computed, reactive, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import OrgAbout from '@/components/management/OrgAbout.vue'
import { useI18n } from 'vue-i18n'
import { FUNC_ID } from '@/utils/constants'
import usePlan from '@/composables/usePlan.js'
import { OgType, type Organization } from '@frontier/platform-web-sdk'
import useNavigation from '@/composables/useNavigation'

const GroupAbout = defineAsyncComponent(
  () => import('@/components/management/GroupAbout.vue')
)
const MemberList = defineAsyncComponent(
  () => import('@/components/management/MemberList.vue')
)
const HistoryList = defineAsyncComponent(
  () => import('@/components/management/HistoryList.vue')
)

const { t } = useI18n()
const store = useStore()
const { goToManagement, ogType, ogId } = useNavigation()
const { checkCanInvitedPeople } = usePlan()

console.log(typeof ogType.value)

const organization = computed<Organization>(
  () => store.getters['organization/organization']
)
const menuOrgOrGroup = computed(() => {
  const { orgId, orgName, labelColor } = organization.value
  return {
    width: 'w-75',
    blockList: [
      {
        menuList: [
          {
            title: orgName,
            selectValue: `${OgType.ORG}-${orgId}`,
            labelColor,
          },
          ...organization.value.groupList.map((group) => {
            const { groupId, groupName, labelColor } = group
            return {
              title: groupName,
              selectValue: `${OgType.GROUP}-${groupId}`,
              labelColor,
            }
          }),
        ],
      },
    ],
  }
})
const tabList = reactive([
  {
    name: t('BB0008'),
    path: 'about',
  },
  {
    name: t('BB0009'),
    path: 'members',
  },
  {
    name: t('BB0010'),
    path: 'history',
  },
])

const toggleTab = (tab: string) => {
  goToManagement({}, tab)
}
const openModalCreateGroup = () => {
  store.dispatch('group/resetCreateForm')
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-group',
  })
}

const inviteHandler = () => {
  if (ogType.value === OgType.ORG) {
    checkCanInvitedPeople() && openModalInviteToOrg()
  } else {
    openModalAddToGroup()
  }
}
const openModalInviteToOrg = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-invite-to-org',
    properties: {
      from: 'org',
    },
  })
}
const openModalAddToGroup = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-add-to-group',
  })
}
</script>

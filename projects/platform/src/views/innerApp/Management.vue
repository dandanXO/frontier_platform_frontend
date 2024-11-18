<template lang="pug">
div(class="px-6 pt-6.5 h-full flex flex-col")
  div(class="h-11 flex justify-between items-center mb-12.5")
    dropdown-og-menu(@select="goToManagement({ ogKey: $event })")
    div(class="flex gap-x-6 items-center")
      div(
        v-if="!(planType.FREE || planType.DESIGNER)"
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
    :initValue="tab"
    @switch="goToManagement({}, $event.path)"
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
import { reactive, defineAsyncComponent, computed } from 'vue'
import { useStore } from 'vuex'
import OrgAbout from '@/components/management/OrgAbout.vue'
import { useI18n } from 'vue-i18n'
import { FUNC_ID } from '@/utils/constants'
import usePlanOld from '@/composables/usePlanOld.js'
import { OgType } from '@frontier/platform-web-sdk'
import useNavigation from '@/composables/useNavigation'
import DropdownOgMenu from '@/components/common/DropdownOgMenu.vue'

const GroupAbout = defineAsyncComponent(
  () => import('@/components/management/GroupAbout.vue')
)
const MemberList = defineAsyncComponent(
  () => import('@/components/management/MemberList.vue')
)
const HistoryList = defineAsyncComponent(
  () => import('@/components/management/HistoryList.vue')
)

defineProps<{
  tab: string
}>()

const { t } = useI18n()
const store = useStore()
const { goToManagement, ogType, ogId } = useNavigation()
const { checkCanInvitedPeople } = usePlanOld()
const planType = computed(() => store.getters['polling/planType'])
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

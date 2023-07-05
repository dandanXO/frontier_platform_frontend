<template lang="pug">
div(class="px-6 pt-6.5 h-full flex flex-col")
  div(class="h-11 flex justify-between items-center mb-12.5")
    f-select-dropdown(
      class="w-75"
      :selectValue="currentMenu"
      :dropdownMenuTree="menuOrgOrGroup"
      @update:selectValue="toggleOrgOrGroup"
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
    :key="isLoading"
    class="flex-grow pr-3"
  )
    template(#default="{ currentTab }")
      div(v-if="isLoading" class="w-full h-full flex justify-center items-center")
        f-svg-icon(iconName="loading" size="92" class="text-primary-400")
      template(v-else)
        template(v-if="currentTab === 'about'")
          org-about(v-if="routeLocation === 'org'")
          group-about(v-else :key="$route.params.groupId")
        member-list(v-else-if="currentTab === 'members'")
        history-list(v-else-if="currentTab === 'history'")
        dashboard(v-else-if="currentTab === 'dashboard'")
</template>

<script setup>
import { ref, computed, reactive, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import OrgAbout from '@/components/management/OrgAbout.vue'
import { useI18n } from 'vue-i18n'
import { FUNC_ID } from '@/utils/constants'
import usePlan from '@/composables/usePlan.js'

const GroupAbout = defineAsyncComponent(() =>
  import('@/components/management/GroupAbout.vue')
)
const MemberList = defineAsyncComponent(() =>
  import('@/components/management/MemberList.vue')
)
const HistoryList = defineAsyncComponent(() =>
  import('@/components/management/HistoryList.vue')
)
const Dashboard = defineAsyncComponent(() =>
  import('@/components/management/Dashboard.vue')
)

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useStore()
const { checkCanInvitedPeople } = usePlan()

const routeLocation = computed(() =>
  route.name === 'OrgManagement' ? 'org' : 'group'
)
const organization = computed(() => store.getters['organization/organization'])
const menuOrgOrGroup = computed(() => {
  const { orgNo, orgName, labelColor } = organization.value
  return {
    width: 'w-75',
    blockList: [
      {
        menuList: [
          {
            title: orgName,
            selectValue: `/${orgNo}/management`,
            labelColor,
          },
          ...store.getters['organization/groupList'].map((group) => {
            const { groupId, groupName, labelColor } = group
            return {
              title: groupName,
              selectValue: `/${orgNo}/${groupId}/management`,
              labelColor,
            }
          }),
        ],
      },
    ],
  }
})
const currentMenu = computed(() => {
  const { orgNo } = organization.value
  return routeLocation.value === 'org'
    ? `/${orgNo}/management`
    : `/${orgNo}/${route.params.groupId}/management`
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
  {
    name: t('BB0138'),
    path: 'dashboard',
  },
])

const isLoading = ref(false)
const toggleOrgOrGroup = async (path) => {
  isLoading.value = true
  await router.push(path + '/about')
  isLoading.value = false
}
const toggleTab = (tab) => {
  router.push({ name: route.name, params: { tab } })
}
const openModalCreateGroup = () => {
  store.dispatch('group/resetCreateForm')
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-group',
  })
}

const inviteHandler = () => {
  if (routeLocation.value === 'org') {
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

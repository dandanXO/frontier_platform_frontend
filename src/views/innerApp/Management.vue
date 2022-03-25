<template lang="pug">
div(class="px-6 pt-6.5 h-full flex flex-col")
  div(class="h-37 flex flex-col justify-between relative z-20")
    div(class="h-11 flex justify-between items-center")
      div(class="w-75 relative z-10")
        input-select(:selectValue="currentMenu" :options="menuOrgOrGroup" keyOptionDisplay="name" keyOptionValue="path" @select="toggleOrgOrGroup")
      div(class="flex gap-x-6 items-center")
        div(v-permission="FUNC_ID.OPEN_CREATE_GROUP" class="flex gap-x-1 items-center cursor-pointer" @click="openModalCreateGroup")
          svg-icon(iconName="add_box" size="20" class="text-brand")
          p(class="text-body2 text-primary") {{ $t("UU0017") }}
        btn(size="sm" prependIcon="person_add" @click="inviteHandler") {{ $t("UU0014") }}
    div(class="border-b border-black-400")
      div(class="flex gap-x-5 pl-3")
        div(v-for="tab in tabList" class="cursor-pointer" @click="toggleTab(tab.path)")
          p(class="pb-2 text-body1" :class="[tab.path === currentTab ? 'border-b-4 border-brand text-primary font-bold' : 'text-black-600']" ) {{ tab.name }}
  div(class="flex-grow")
    div(v-if="isLoading" class="w-full h-full flex justify-center items-center")
      svg-icon(iconName="loading" size="92" class="text-brand")
    template(v-else)
      template(v-if="currentTab === 'about'")
        org-about(v-if="routeLocation === 'org'")
        group-about(v-else :key="$route.params.groupId")
      member-list(v-else-if="currentTab === 'members'")
      history-list(v-else-if="currentTab === 'history'")
</template>

<script>
import { ref, computed, reactive, defineAsyncComponent, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import OrgAbout from '@/components/management/OrgAbout.vue'
import { useI18n } from 'vue-i18n'
import { FUNC_ID } from '@/utils/constants'
import usePlan from '@/composables/usePlan.js'

export default {
  name: 'Management',
  components: {
    OrgAbout,
    GroupAbout: defineAsyncComponent(() => import('@/components/management/GroupAbout.vue')),
    MemberList: defineAsyncComponent(() => import('@/components/management/MemberList.vue')),
    HistoryList: defineAsyncComponent(() => import('@/components/management/HistoryList.vue'))
  },
  setup () {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const { checkCanInvitedPeople } = usePlan()
    const isLoading = ref(false)

    const orgUser = computed(() => store.getters['user/orgUser/orgUser'])
    const routeLocation = computed(() => route.name === 'OrgManagement' ? 'org' : 'group')
    const organization = computed(() => store.getters['organization/organization'])
    const menuOrgOrGroup = computed(() => {
      const { orgNo, orgName } = organization.value
      return [
        {
          name: orgName,
          path: `/${orgNo}/management`
        },
        ...store.getters['organization/groupList'].map(group => {
          const { groupId, groupName } = group
          return {
            name: groupName,
            path: `/${orgNo}/${groupId}/management`
          }
        })
      ]
    })
    const currentTab = computed(() => route.params.tab)
    const currentMenu = computed(() => {
      const { orgNo } = organization.value
      return routeLocation.value === 'org'
        ? `/${orgNo}/management`
        : `/${orgNo}/${route.params.groupId}/management`
    })
    const tabList = reactive([
      {
        name: t('BB0008'),
        path: 'about'
      },
      {
        name: t('BB0009'),
        path: 'members'
      },
      {
        name: t('BB0010'),
        path: 'history'
      }
    ])

    const toggleOrgOrGroup = (path) => {
      router.push(path + '/about')
    }
    const toggleTab = (tab) => {
      router.push({ name: route.name, params: { tab } })
    }
    const openModalCreateGroup = () => {
      store.dispatch('group/resetCreateForm')
      store.dispatch('helper/openModal', {
        component: 'modal-create-group'
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
      store.dispatch('helper/openModal', {
        component: 'modal-invite-to-org',
        properties: {
          from: 'org'
        }
      })
    }
    const openModalAddToGroup = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-add-to-group'
      })
    }

    onBeforeMount(async () => {
      try {
        isLoading.value = true
        if (routeLocation.value === 'group' && currentTab.value === 'about') {
          await store.dispatch('group/getGroup', { groupId: route.params.groupId })
        }
      } finally {
        isLoading.value = false
      }
    })

    return {
      currentMenu,
      menuOrgOrGroup,
      currentTab,
      tabList,
      toggleTab,
      toggleOrgOrGroup,
      routeLocation,
      inviteHandler,
      openModalCreateGroup,
      isLoading,
      FUNC_ID,
      orgUser
    }
  }
}
</script>

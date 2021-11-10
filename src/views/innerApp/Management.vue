<template lang="pug">
div(class="px-6 pt-6.5 h-full flex flex-col")
  div(class="h-37 flex flex-col justify-between relative")
    div(class="h-11 flex justify-between items-center")
      div(class="w-75 relative z-10")
        input-select(:selectValue="currentMenu" :options="menuOrgOrGroup" keyOptionDisplay="name" keyOptionValue="path" @select="toggleOrgOrGroup")
      div(class="flex gap-x-6 items-center")
        div(class="flex gap-x-1 items-center cursor-pointer" @click="openModalCreateGroup")
          svg-icon(iconName="add_box" size="20" class="text-brand")
          p(class="text-body2 text-primary") {{$t('UU0017')}}
        btn(size="sm" prependIcon="person_add" @click="routeLocation === 'org' ? openModalInviteToOrg() : openModalAddToGroup()") {{$t('UU0014')}}
    div(class="border-b border-black-400")
      div(class="flex gap-x-5 pl-3")
        div(v-for="tab in tabList" class="cursor-pointer" @click="toggleTab(tab.path)")
          p(class="pb-2 text-body1" :class="[tab.path === currentTab ? 'border-b-4 border-brand text-primary font-bold' : 'text-black-600' ]" ) {{tab.name}}
  div(class="flex-grow")
    template(v-if="currentTab === 'about'")
      org-about(v-if="routeLocation === 'org'")
      group-about(v-else :key="$route.params.groupId")
    member-list(v-else-if="currentTab === 'members'" :memberList="memberList")
    history-list(v-else-if="currentTab === 'history'" :historyList="historyList")
</template>

<script>
import { computed, reactive } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'
import OrgAbout from '@/components/management/OrgAbout.vue'
import GroupAbout from '@/components/management/GroupAbout.vue'
import MemberList from '@/components/management/MemberList.vue'
import HistoryList from '@/components/management/HistoryList.vue'
import InputLabelColor from '@/components/InputLabelColor'
import { ROLE_ID } from '@/utils/constants'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Management',
  components: {
    InputLabelColor,
    OrgAbout,
    GroupAbout,
    MemberList,
    HistoryList
  },
  setup () {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const memberList = computed(() => {
      const orgMemberList = store.getters['organization/memberList']
      if (routeLocation.value === 'org') {
        return orgMemberList
      }

      return orgMemberList
        .filter(member => member.orgRoleId === ROLE_ID.OWNER || member.orgRoleId === ROLE_ID.ADMIN)
        .map(member => ({
          groupUserId: null,
          groupRoleId: member.orgRoleId,
          ...member
        }))
        .concat(store.getters['group/memberList'])
    })
    const historyList = computed(() => routeLocation.value === 'org' ? store.getters['organization/historyList'] : store.getters['group/historyList'])
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

    onBeforeRouteUpdate(async (to, from) => {
      if (routeLocation.value === 'group') {
        to.params.groupId !== from.params.groupId && await store.dispatch('group/getGroup', { groupId: to.params.groupId })
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
      openModalCreateGroup,
      openModalInviteToOrg,
      openModalAddToGroup,
      memberList,
      historyList
    }
  }
}
</script>

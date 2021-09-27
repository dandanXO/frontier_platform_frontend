<template lang="pug">
div(class="px-6 pt-6.5 h-full flex flex-col")
  div(class="h-37 flex flex-col justify-between relative")
    div(class="h-11 flex justify-between items-center")
      div(class="w-75 relative z-10")
        input-select(:selectValue="currentMenu" :options="menuOrgOrGroup" keyOptionDisplay="name" keyOptionValue="path" @select="toggleOrgOrGroup")
      div(class="flex gap-x-6 items-center")
        div(class="flex gap-x-1 items-center cursor-pointer" @click="openModalCreateGroup")
          svg-icon(iconName="add_box" size="20" class="text-brand")
          p(class="text-body2 text-primary") {{$t('reuse.createGroup')}}
        btn(size="sm" prependIcon="person_add" @click="location === 'org' ? openModalInviteToOrg() : openModalAddToGroup()") {{$t('reuse.invite')}}
    div(class="border-b border-black-400")
      div(class="flex gap-x-5 pl-3")
        div(v-for="tab in tabList" class="cursor-pointer" @click="toggleTab(tab.path)")
          p(class="pb-2 text-body1" :class="[tab.path === currentTab ? 'border-b-4 border-brand text-primary font-bold' : 'text-black-600' ]" ) {{$t(tab.name)}}
  router-view(class="flex-grow")
</template>

<script>
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import InputLabelColor from '@/components/InputLabelColor'
import ModalInviteToOrg from '@/components/management/ModalInviteToOrg'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'Management',
  components: {
    InputLabelColor,
    ModalInviteToOrg
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const { location } = useNavigation()

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
            path: `/${orgNo}/management/${groupId}`
          }
        })
      ]
    })
    const currentTab = computed(() => route.params.tab)
    const currentMenu = computed(() => {
      const { orgNo } = organization.value
      return location.value === 'org'
        ? `/${orgNo}/management`
        : `/${orgNo}/management/${route.params.groupId}`
    })
    const tabList = reactive([
      {
        name: 'b.about',
        path: 'about'
      },
      {
        name: 'b.member',
        path: 'members'
      },
      {
        name: 'b.history',
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

    return {
      currentMenu,
      menuOrgOrGroup,
      currentTab,
      tabList,
      toggleTab,
      toggleOrgOrGroup,
      location,
      openModalCreateGroup,
      openModalInviteToOrg,
      openModalAddToGroup
    }
  }
}
</script>

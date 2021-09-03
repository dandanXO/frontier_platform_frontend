<template lang="pug">
div(class="px-6 pt-6.5 h-full flex flex-col")
  div(class="h-37 flex flex-col justify-between relative")
    div(class="h-11 flex justify-between items-center")
      div(class="w-75 relative z-10")
        input-select(v-model:selectValue="currentMenu" :options="menuOrgOrGroup" keyOptionDisplay="name" keyOptionValue="path" @select="toggleOrgOrGroup")
      div(class="flex gap-x-6")
        modal(:primaryText="$t('reuse.save')" :primaryHandler="createGroup" :primaryDisabled="!avaliableToCreateGroup" @close="modalCloseHandler")
          template(#activator="{ open }")
            div(class="h-full flex gap-x-1 items-center cursor-pointer" @click="open")
              svg-icon(iconName="add_box" size="20" class="text-brand")
              p(class="text-body2 text-primary") {{$t('reuse.createGroup')}}
          div(class="w-full")
            h6(class="text-h6 text-primary font-bold text-center pb-7.5") {{$t('b.createGroup')}}
            input-label-color(
              v-model:labelColor="groupFormData.labelColor"
              v-model:textValue="groupFormData.groupName"
              :label="$t('b.groupName')"
              :placeholder="$t('b.yourGroupName')"
              :hasSlotContent="isGroupNameExist"
              required
              class="w-85 relative z-11 mb-7.5"
            )
              template(#errorMsg v-if="isGroupNameExist")
                p(class="absolute text-warn text-caption pt-1") {{$t('err.nameAlreadyExists')}}
            input-textarea(v-model:textValue="groupFormData.description" :label="$t('b.groupDescription')" :placeholder="$t('b.groupDescribeToUnderstand')" class="w-85 mb-1" height="160")
            div(class="flex items-center pb-0.5")
              svg-icon(size="14" iconName="error_outline" class="text-primary")
              p(class="pl-1.5 text-caption text-primary") {{$t('b.afterGroupCreate')}}
        modal-invite-to-org(:via="'org'")
          template(#activator="{ open }")
            btn(size="sm" prependIcon="person_add" @click="open") {{$t('reuse.invite')}}
    div(class="border-b border-black-400")
      div(class="flex gap-x-5 pl-3")
        div(v-for="tab in tabList" class="cursor-pointer" @click="toggleTab(tab.path)")
          p(class="pb-2 text-body1" :class="[tab.path === currentTab ? 'border-b-4 border-brand text-primary font-bold' : 'text-black-600' ]" ) {{$t(tab.name)}}
  router-view(class="flex-grow")
</template>

<script>
import { computed, reactive, ref, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import InputLabelColor from '@/components/InputLabelColor'
import ModalInviteToOrg from '@/components/modal/ModalInviteToOrg'

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

    const organization = computed(() => store.getters['organization/organization'])
    const menuOrgOrGroup = computed(() => {
      const { orgNo, orgName } = organization.value
      return [
        {
          name: orgName,
          path: `/${orgNo}/management/about`
        },
        ...store.getters['organization/groupList'].map(group => {
          const { groupId, groupName } = group
          return {
            name: groupName,
            path: `/${orgNo}/management/${groupId}/about`
          }
        })
      ]
    })
    const currentTab = computed(() => route.params.tab)
    const currentMenu = ref(decodeURI(route.path))
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
      router.push(path)
    }

    const toggleTab = (tab) => {
      router.push({ name: route.name, params: { tab } })
    }
    const initialGroupFormData = {
      groupName: '',
      labelColor: '#D3242A',
      description: ''
    }
    const groupFormData = reactive({ ...initialGroupFormData })
    const isGroupNameExist = computed(() => store.getters['organization/groupList'].some(group => group.groupName === groupFormData.groupName))
    const avaliableToCreateGroup = computed(() => groupFormData.groupName !== '' && !isGroupNameExist.value)
    const createGroup = async () => {
      await store.dispatch('group/createGroup', toRaw(groupFormData))
    }
    const resetGroupFormData = () => {
      Object.assign(groupFormData, initialGroupFormData)
    }
    const modalCloseHandler = () => {
      resetGroupFormData()
      /**
       * @todo: create group upload email
       */
    }

    return {
      currentMenu,
      menuOrgOrGroup,
      currentTab,
      tabList,
      toggleTab,
      toggleOrgOrGroup,
      createGroup,
      groupFormData,
      avaliableToCreateGroup,
      isGroupNameExist,
      modalCloseHandler
    }
  }
}
</script>

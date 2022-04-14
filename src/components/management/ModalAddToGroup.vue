<template lang="pug">
div(class="w-118.5")
  div(class="px-8")
    h6(class="text-h6 text-primary font-bold pb-7.5 text-center") {{$t('BB0095', { groupName: group.groupName })}}
    input-text(v-model:textValue="searchInput" size="lg" class="pb-7" prependIcon="search" :placeholder="$t('BB0012')")
  overlay-scrollbar-container(class="h-75 mx-2 border-t border-b border-primary-thin")
    div(v-if="memberList.length > 0" class="grid gap-y-2 py-3.5" @mouseleave="indexOfOnHover = -1")
      label(v-for="(member, index) in memberList" class="px-6 h-12 flex items-center hover:bg-black-200" :for="member.orgUserId" @mouseenter="indexOfOnHover = index")
        div
          img(v-if="member.avatar !== null" :src="member.avatar" class="w-9 h-9 rounded-full")
          div(v-else class="w-9 h-9 rounded-full border border-primary border-dashed")
        template(v-if="member.isPending")
          p(class="flex-grow pl-4 text-body2 text-primary") {{member.email}}
          p(class="text-body2 text-black-500") {{$t('BB0024')}}
        template(v-else-if="member.joined")
          p(class="flex-grow pl-4 text-body2 text-primary") {{member.displayName}}
          p(class="text-body2 text-black-500") {{$t('BB0097')}}
        template(v-else)
          p(class="flex-grow pl-4 text-body2 text-primary") {{member.displayName}}
          input-checkbox(v-if="addedMemberList.includes(member.orgUserId) || index === indexOfOnHover" v-model:inputValue="addedMemberList" type="checkbox" :value="member.orgUserId")
    p(v-else class="text-body1 text-primary text-center pt-9.5") {{$t('BB0031')}}
  div(class="py-3 flex justify-center items-center")
    btn(size="sm" :disabled="addedMemberList.length === 0" @click="addMemberToGroup") {{$t('UU0014')}}
  div(class="bg-black-100 h-15 pl-8 flex items-center cursor-pointer" @click="openModalInviteToOrg")
    svg-icon(iconName="add_box" size="20" class="text-brand")
    p(class="pl-2.5 text-body1 text-primary") {{$t('BB0096')}}
</template>

<script>
import ModalInviteToOrg from '@/components/management/ModalInviteToOrg.vue'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
import { ref } from 'vue'
import { ROLE_ID } from '@/utils/constants'
import usePlan from '@/composables/usePlan.js'

export default {
  name: 'ModalAddToGroup',
  components: {
    ModalInviteToOrg
  },
  setup () {
    const store = useStore()
    const { checkCanInvitedPeople } = usePlan()
    const searchInput = ref('')
    const orgMemberList = computed(() => store.getters['organization/memberList'])
    const groupMemberList = computed(() => store.getters['group/memberList'])
    const memberList = computed(() => {
      return orgMemberList.value
        .filter(orgMember => orgMember.displayName?.includes(searchInput.value) || orgMember.email.includes(searchInput.value))
        .map(orgMember => {
          const joined = [ROLE_ID.OWNER, ROLE_ID.ADMIN].includes(orgMember.orgRoleId) || groupMemberList.value.some(groupMember => groupMember.email === orgMember.email)
          return {
            joined,
            ...orgMember
          }
        })
        .sort((a, b) => {
          if (b.isPending || b.joined) {
            return -1
          }
        })
    })
    const group = computed(() => store.getters['group/group'])
    const addedMemberList = ref([])
    const indexOfOnHover = ref(-1)

    const openModalInviteToOrg = () => {
      checkCanInvitedPeople() && store.dispatch('helper/openModal', {
        component: 'modal-invite-to-org',
        properties: {
          from: 'group'
        }
      })
    }
    const addMemberToGroup = async () => {
      store.dispatch('helper/pushModalLoading')
      await store.dispatch('group/addMemberToGroup', { orgUserIdList: addedMemberList.value })
      store.dispatch('helper/clearModalPipeline')
    }

    return {
      group,
      memberList,
      openModalInviteToOrg,
      searchInput,
      addedMemberList,
      indexOfOnHover,
      addMemberToGroup
    }
  }
}
</script>

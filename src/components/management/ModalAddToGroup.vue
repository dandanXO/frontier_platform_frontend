<template lang="pug">
modal-behavior(
  :header="$t('BB0095', { groupName: group.groupName })"
  :primaryBtnText="$t('UU0014')"
  :primaryBtnDisabled="addedMemberList.length === 0"
  @click:primary="addMemberToGroup"
)
  div(class="w-94")
    div(class="flex items-center mb-4")
      div(class="text-body2 font-bold text-primary") {{ $t("BB0111") }}
      div(class="text-black-600 font-bold text-caption ml-4")
        span(:class="{'text-brand': addedMemberList.length>0}") {{ addedMemberList.length }}
        span /{{ orgMemberList.length }}
    input-text(v-model:textValue="searchInput" size="lg" class="mb-1.5" prependIcon="search" :placeholder="$t('BB0012')")
    overlay-scrollbar-container(class="h-75 mt-2 -mx-5")
      div(v-if="memberList.length > 0" class="grid gap-y-1 mx-5" @mouseleave="indexOfOnHover = -1")
        label(v-for="(member, index) in memberList" class="pl-2 pr-4 h-12 flex items-center justify-between hover:bg-black-200" :for="member.orgUserId" @mouseenter="indexOfOnHover = index")
          div(class="flex items-center")
            div(class="w-9 h-9 rounded-full bg-cover bg-center" :class="{ 'opacity-30': member.isPending || member.joined }" :style="{ 'background-image': `url(${member.avatar})` }")
            template(v-if="member.isPending")
              span(class="flex-grow pl-4 text-body2 text-black-500") {{ member.email }}
              span(class="text-body2 text-black-500") ({{ $t("BB0024") }})
            template(v-else-if="member.joined")
              span(class="flex-grow pl-4 text-body2 text-black-500") {{ member.displayName }}
              span(class="text-body2 text-black-500") ({{ $t("BB0097") }})
            template(v-else)
              span(class="flex-grow pl-4 text-body2 text-primary") {{ member.displayName }}
          template(v-if="!member.isPending && !member.joined")
            input-checkbox(
              v-if="addedMemberList.includes(member.orgUserId) || index === indexOfOnHover"
              v-model:inputValue="addedMemberList"
              type="checkbox"
              :value="member.orgUserId"
              uncheckColor="text-black-600"
            )
      p(v-else class="text-body1 text-primary text-center pt-9.5") {{ $t("BB0031") }}
  template(#note)
    div(class="flex items-center cursor-pointer text-assist-blue" @click="openModalInviteToOrg")
      svg-icon(iconName="add_box_outline" size="14")
      p(class="pl-1.5 text-caption") {{ $t("BB0096") }}
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
import { ref } from 'vue'
import { ROLE_ID } from '@/utils/constants'
import usePlan from '@/composables/usePlan.js'

const store = useStore()
const { checkCanInvitedPeople } = usePlan()
const searchInput = ref('')
const group = computed(() => store.getters['group/group'])
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
const addedMemberList = ref([])
const indexOfOnHover = ref(-1)

const openModalInviteToOrg = () => {
  checkCanInvitedPeople() && store.dispatch('helper/openModalBehavior', {
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
</script>

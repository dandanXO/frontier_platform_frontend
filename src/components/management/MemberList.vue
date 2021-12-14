<template lang="pug">
div(class="pt-2.5 h-full flex flex-col relative")
  div(class="absolute right-0 -top-3.5 transform -translate-y-full")
    input-text(v-model:textValue="searchInput" size="sm" class="w-67.5" prependIcon="search" :placeholder="$t('BB0012')")
  div(class="w-full h-12 bg-black-200 l:pl-21 pl-25 2xl:pl-35 flex items-center text-body1 text-primary")
    p(class="l:w-46.5 w-61.5 2xl:w-74") {{$t('BB0013')}}
    p(class="l:w-65 w-83.5 2xl:w-105") {{$t('BB0014')}}
    p(class="l:w-41 w-54.5 2xl:w-82.5") {{$t('BB0015')}}
    p {{$t('BB0016')}}
  div(class="py-6 flex-grow")
    overlay-scrollbar-container(class="h-full")
      div(class="grid gap-y-2.5")
        member-row(v-for="(member, index) in filteredMemberList" :member="member" class="relative" :class="`z-${100-index}`")
</template>

<script>
import { computed, ref } from 'vue'
import MemberRow from '@/components/management/MemberRow'
import { useStore } from 'vuex'
import { ROLE_ID } from '@/utils/constants'

export default {
  name: 'MemberList',
  components: {
    MemberRow
  },
  setup () {
    const store = useStore()
    const searchInput = ref('')
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
    const filteredMemberList = computed(() => memberList.value.filter(member => member.displayName?.includes(searchInput.value) || member.email.includes(searchInput.value)))

    return {
      filteredMemberList,
      searchInput
    }
  }
}
</script>

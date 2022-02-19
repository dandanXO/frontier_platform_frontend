<template lang="pug">
div(class="pt-2.5 h-full flex flex-col relative")
  div(class="absolute z-20 right-0 -top-3.5 transform -translate-y-full")
    input-text(v-model:textValue="searchInput" size="sm" class="w-67.5" prependIcon="search" :placeholder="$t('BB0012')")
  div(class="w-full h-12 bg-black-200 flex gap-x-3 items-center text-body1 text-primary")
    p(class="w-1/12")
    p(class="w-2/12") {{$t('BB0013')}}
    p(class="w-4/12") {{$t('BB0014')}}
    p(class="w-2/12") {{$t('BB0015')}}
    p(class="w-2/12") {{$t('BB0016')}}
    p(class="w-1/12")
  div(class="py-6 flex-grow")
    overlay-scrollbar-container(class="h-full")
      div(class="grid gap-y-2.5")
        member-row(v-for="(member, index) in filteredMemberList" :member="member")
</template>

<script>
import { computed, ref } from 'vue'
import MemberRow from '@/components/management/MemberRow.vue'
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

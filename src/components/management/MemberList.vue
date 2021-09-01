<template lang="pug">
div(class="pt-2.5 flex flex-col relative")
  div(class="absolute right-0 -top-3.5 transform -translate-y-full")
    input-text(v-model:textValue="searchInput" size="sm" class="w-67.5" prependIcon="search" :placeholder="$t('b.searchMember')")
  div(class="w-full h-12 bg-black-200 l:pl-21 pl-25 2xl:pl-35 flex items-center text-body1 text-primary")
    p(class="l:w-46.5 w-61.5 2xl:w-74") {{$t('b.name')}}
    p(class="l:w-65 w-83.5 2xl:w-105") {{$t('b.email')}}
    p(class="l:w-41 w-54.5 2xl:w-82.5") {{$t('b.role')}}
    p {{$t('b.lastLogin')}}
  div(class="py-6 flex-grow")
    overlay-scrollbar-container(class="h-full")
      div(class="grid gap-y-2.5")
        member-row(v-for="member in filteredmemberList" :member="member")
</template>

<script>
import { computed, ref } from 'vue'
import MemberRow from '@/components/management/MemberRow'

export default {
  name: 'MemeberList',
  components: {
    MemberRow
  },
  props: {
    memberList: {
      type: Array,
      required: true
    }
  },
  setup (props) {
    const searchInput = ref('')
    const filteredmemberList = computed(() => props.memberList.filter(member => member.displayName?.includes(searchInput.value) || member.email.includes(searchInput.value)))

    return {
      filteredmemberList,
      searchInput
    }
  }
}
</script>

<template lang="pug">
org-about(v-if="tab === 'about'")
member-list(v-else-if="tab === 'members'" :memberList="memberList")
history-list(v-else-if="tab === 'history'" :historyList="historyList")
</template>

<script>
import OrgAbout from '@/components/management/OrgAbout.vue'
import MemberList from '@/components/management/MemberList.vue'
import HistoryList from '@/components/management/HistoryList.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ManagementOrg',
  components: {
    OrgAbout,
    MemberList,
    HistoryList
  },
  props: {
    tab: {
      type: String,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const memberList = computed(() => store.getters['organization/memberList'])
    const historyList = computed(() => store.getters['organization/historyList'])

    return {
      memberList,
      historyList
    }
  }
}
</script>

<template lang="pug">
group-about(v-if="tab === 'about'" :key="groupId")
member-list(v-else-if="tab === 'members'" :memberList="memberList")
history-list(v-else-if="tab === 'history'" :historyList="historyList")
</template>

<script>
import GroupAbout from '@/components/management/GroupAbout.vue'
import MemberList from '@/components/management/MemberList.vue'
import HistoryList from '@/components/management/HistoryList.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { onBeforeRouteUpdate } from 'vue-router'

export default {
  name: 'ManagementGroup',
  components: {
    GroupAbout,
    MemberList,
    HistoryList
  },
  props: {
    tab: {
      type: String,
      required: true
    },
    groupId: {
      type: [String, Number],
      required: true
    }
  },
  setup () {
    const store = useStore()
    const memberList = computed(() => store.getters['group/memberList'])
    const historyList = computed(() => store.getters['group/historyList'])

    onBeforeRouteUpdate(async (to, from) => {
      to.params.groupId !== from.params.groupId && await store.dispatch('group/getGroup', { groupId: to.params.groupId })
    })

    return {
      memberList,
      historyList
    }
  }
}
</script>

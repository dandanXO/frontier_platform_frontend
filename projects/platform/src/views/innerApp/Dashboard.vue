<template>
  <DashboardNew v-if="showNewDashboard" />
  <DashboardOld v-else />
</template>

<script setup lang="ts">
// Ensure the component has a multi-word name for linting
defineOptions({ name: 'DashboardSwitcher' })

import { computed } from 'vue'
import { useStore } from 'vuex'
import DashboardNew from './DashboardNew.vue'
import DashboardOld from './DashboardOld.vue'

// feature-flag driven Dashboard switch
const store = useStore()
const showNewDashboard = computed(
  () => store.getters['permission/isEnableNewDashboard']
)
</script>

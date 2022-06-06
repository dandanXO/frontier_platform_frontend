<template lang="pug">
router-view
flash-message
modal-pipeline
</template>

<script setup>
import ModalPipeline from '@/components/common/modal/ModalPipeline.vue'
import { useStore } from 'vuex'

const store = useStore()
store.dispatch('code/getRoleList')
store.dispatch('code/getOrgCategoryList')
store.dispatch('code/getRoleLimitTable')
store.dispatch('code/getCountryList')
store.dispatch('code/getFilterOptions')
</script>

<style lang="scss">
@import "@/assets/scss/main.scss";
</style>

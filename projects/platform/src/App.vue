<template lang="pug">
router-view
flash-message
modal-pipeline
</template>

<script setup>
import ModalPipeline from '@/components/common/modal/ModalPipeline.vue'
import FlashMessage from '@/components/common/FlashMessage.vue'
import { useStore } from 'vuex'

const store = useStore()
store.dispatch('code/fetchCode')
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>

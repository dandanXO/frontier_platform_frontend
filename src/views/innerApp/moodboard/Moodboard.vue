<template lang="pug">
div {{ $route.name }}
  btn(size="md" @click="openCreateOrEditMoodboard") Create Moodboard
</template>

<script setup>
import { useStore } from 'vuex'

const store = useStore()

const openCreateOrEditMoodboard = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-moodboard',
  })
}
</script>

<template lang="pug">
div {{ $route.name }}
  btn(size="md" @click="openCreateOrEditMoodboard") Create Moodboard
  div
    div(v-for="moodboard in moodboardList" class="flex")
      p {{ moodboard.moodboardName }}
      btn(size="sm" @click="goToMoodboardDetail(moodboard.moodboardId)") Enter
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from '@vue/reactivity'
import useNavigation from '@/composables/useNavigation.js'

const store = useStore()
const { goToMoodboardDetail } = useNavigation()

const moodboardList = computed(() => store.getters['moodboard/moodboardList'](1))

const openCreateOrEditMoodboard = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-moodboard',
  })
}

await store.dispatch('moodboard/getMoodboardList')
</script>

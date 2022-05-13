<template lang="pug">
div(class="h-full")
  //- Upper Part
  div
    p {{ $route.name }}
    btn(size="sm" @click="openCreateOrEditMoodboard") Edit
  //- Lower Part
  template(v-if="moodboard.moodboardType === MOODBOARD_TYPE.DEMANDER")
    moodboard-detail-lower-block-demander
  template(v-else-if="moodboard.moodboardType === MOODBOARD_TYPE.PROVIDER")
    moodboard-detail-lower-block-provider
</template>

<script setup>
import { computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import { MOODBOARD_TYPE, CREATE_EDIT } from '@/utils/constants.js'
import MoodboardDetailLowerBlockProvider from '@/views/innerApp/moodboard/MoodboardDetailLowerBlockProvider.vue'
import MoodboardDetailLowerBlockDemander from '@/views/innerApp/moodboard/MoodboardDetailLowerBlockDemander.vue'

const store = useStore()

const props = defineProps({
  moodboardId: {
    type: Number,
    required: true
  }
})

const moodboard = computed(() => store.getters['moodboard/moodboard'])

const openCreateOrEditMoodboard = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-moodboard',
    properties: {
      mode: CREATE_EDIT.EDIT
    }
  })
}

await store.dispatch('moodboard/getMoodboard', { moodboardId: props.moodboardId })
</script>

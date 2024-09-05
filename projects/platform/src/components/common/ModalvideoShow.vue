<template lang="pug">
modal-behavior(
  :header="title"
  :primaryBtnText="''"
  :secondaryBtnText="''"
  :footer="false"
)
  iframe(
    class="rounded-xl"
    width="560"
    height="315"
    :src="innerVideoUrl"
    :title="title"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  )
  div(class="w-full flex justify-center")
    f-button(class="w-44 mt-6" size="sm" type="primary" @click="closeModalBehavior") {{ $t('UU0094') }}
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { useStore } from 'vuex'
const props = defineProps<{
  videoUrl?: string
  title?: string
}>()

const innerVideoUrl = toRef(props.videoUrl)
const store = useStore()
const closeModalBehavior = () => store.dispatch('helper/closeModalBehavior')
</script>

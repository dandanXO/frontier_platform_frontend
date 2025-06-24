<template lang="pug">
div(
  v-if="!hide"
  class="absolute right-14.5 top-14 z-10 w-72 drop-shadow rounded bg-white p-4 flex flex-col gap-y-4"
)
  div
    p(class="text-sm") {{ descriptionText }}
  div(class="flex justify-end")
    f-button(size="sm" type="primary" @click="handleClose") {{ $t('UU0094') }}
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  name: string
  descriptionText: string
}>()

const hide = ref(sessionStorage.getItem(props.name) === 'true')

const handleClose = () => {
  sessionStorage.setItem(props.name, 'true')
  hide.value = true
}
</script>

<template lang="pug">
div
  div(class="flex items-center h-9.5")
    div(class="flex-grow pr-3.5 flex items-center gap-x-3")
      f-avatar(
        :imageUrl="avatar"
        :type="addTo === STICKER_ADD_TO.EXTERNAL ? 'org' : 'user'"
        :labelColor="organization.labelColor"
        size="sm"
      )
      div(class="flex-1")
        p(class="font-bold text-grey-900 text-caption leading-1.6 truncate") {{ organization.orgName }}
        p(
          v-if="addTo === STICKER_ADD_TO.INTERNAL"
          class="pt-1 text-grey-800 text-caption"
        ) {{ orgUser.displayName }}
    div(
      class="flex-shrink-0 w-7 h-7 bg-grey-0 border border-grey-150 flex items-center justify-center rounded mr-1.5"
      @click="emits('mentionTrigger')"
      :class="[addTo === STICKER_ADD_TO.EXTERNAL ? 'text-grey-150 pointer-events-none' : 'text-grey-900 cursor-pointer']"
    )
      f-svg-icon(iconName="mention" size="16")
    div(
      class="flex-shrink-0 w-7 h-7 bg-grey-0 border border-grey-150 flex items-center justify-center rounded mr-4 cursor-pointer"
      @click="emits('tagInputTrigger')"
    )
      f-svg-icon(
        iconName="tag"
        size="16"
        class="text-grey-900"
        :tooltip="$t('TT0053')"
      )
    f-button(
      size="sm"
      :disabled="addButtonDisabled"
      @click="emits('addButtonClick')"
    ) {{ $t('UU0035') }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { STICKER_ADD_TO } from '@/utils/constants'
import { useStore } from 'vuex'

const props = defineProps<{
  addButtonDisabled: boolean
  addTo: number
  tagList: string[]
}>()

const emits = defineEmits<{
  (e: 'addButtonClick'): void
  (e: 'mentionTrigger'): void
  (e: 'tagInputTrigger'): void
  (e: 'update:tagList', v: any): void
}>()

const store = useStore()

const organization = computed(() => store.getters['organization/organization'])
const orgUser = computed(() => store.getters['organization/orgUser/orgUser'])
const avatar = computed(() => {
  return props.addTo === STICKER_ADD_TO.EXTERNAL
    ? organization.value.logo
    : orgUser.value.avatar
})
</script>

<style scoped></style>

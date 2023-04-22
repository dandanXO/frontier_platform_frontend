<template lang="pug">
div(class="flex-grow flex-shrink min-w-0 pr-3.5 flex items-center gap-x-3")
  f-avatar(
    :imageUrl="avatar"
    :type="avatarType"
    :labelColor="labelColor"
    size="sm"
    :hasBorder="false"
  )
  div(class="flex-shrink min-w-0")
    f-tooltip(isNotFitWidth)
      template(#trigger)
        p(
          class="whitespace-nowrap text-ellipsis overflow-hidden text-caption text-grey-900 font-bold leading-1.6"
        ) {{ primaryInfoText }}
      template(#content)
        p {{ primaryInfoText }}
    f-tooltip(isNotFitWidth)
      template(#trigger)
        p(
          class="whitespace-nowrap text-ellipsis overflow-hidden text-caption text-grey-600 leading-1.6"
        ) {{ secondaryInfoText }}
      template(#content)
        p {{ secondaryInfoText }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import useStickerEditorCreatorInfo from '@/composables/useStickerEditorCreatorInfo'

const props = defineProps<{
  addFrom: object
  addTo: number
}>()

const store = useStore()

const organization = computed(() => store.getters['organization/organization'])
const orgUser = computed(() => store.getters['organization/orgUser/orgUser'])
const addFrom = computed(() => props.addFrom)
const addTo = computed(() => props.addTo)

const { avatar, avatarType, labelColor, primaryInfoText, secondaryInfoText } =
  useStickerEditorCreatorInfo(organization, orgUser, addFrom, addTo)
</script>

<style scoped></style>

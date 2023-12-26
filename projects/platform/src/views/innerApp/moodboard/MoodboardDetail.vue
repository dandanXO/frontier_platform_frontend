<template lang="pug">
div(v-if="moodboard" class="h-full")
  div(class="ml-8 mt-12 mb-16")
    global-breadcrumb-list(
      :breadcrumbList="locationList"
      @click:item="$event.goTo()"
    )
  moodboard-detail-upper-block(:moodboard="moodboard")
  template(v-if="moodboard.moodboardType === MOODBOARD_TYPE.DEMANDER")
    moodboard-detail-lower-block-demander(:moodboard="moodboard")
  template(v-else-if="moodboard.moodboardType === MOODBOARD_TYPE.PROVIDER")
    moodboard-detail-lower-block-provider(:moodboard="moodboard")
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MOODBOARD_TYPE } from '@/utils/constants'
import MoodboardDetailLowerBlockDemander from '@/components/moodboard/MoodboardDetailLowerBlockDemander.vue'
import MoodboardDetailLowerBlockProvider from '@/components/moodboard/MoodboardDetailLowerBlockProvider.vue'
import MoodboardDetailUpperBlock from '@/components/moodboard/MoodboardDetailUpperBlock.vue'
import useNavigation from '@/composables/useNavigation'
import { useMoodboardStore } from '@/stores/moodboard'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  moodboardId: string
}>()

const { t } = useI18n()
const moodboardStore = useMoodboardStore()
const { moodboard } = storeToRefs(moodboardStore)
const { getMoodboard } = moodboardStore
const { goToMoodboard, goToMoodboardDetail } = useNavigation()

await getMoodboard(Number(props.moodboardId))

const locationList = computed(() => {
  return [
    {
      name: t('QQ0001'),
      goTo: () => goToMoodboard(),
    },
    {
      name: moodboard.value!.moodboardName,
      goTo: () => goToMoodboardDetail({}, Number(props.moodboardId)),
    },
  ]
})
</script>

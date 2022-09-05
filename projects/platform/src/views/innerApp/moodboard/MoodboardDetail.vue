<template lang="pug">
div(class="h-full")
  div(class="ml-8 mt-12 mb-16")
    f-breadcrumb(:breadcrumbList="breadcrumbList" @click:item="$router.push($event.path)")
  moodboard-detail-upper-block
  template(v-if="moodboard.moodboardType === MOODBOARD_TYPE.DEMANDER")
    moodboard-detail-lower-block-demander
  template(v-else-if="moodboard.moodboardType === MOODBOARD_TYPE.PROVIDER")
    moodboard-detail-lower-block-provider
</template>

<script setup>
import { computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { MOODBOARD_TYPE, MOODBOARD_TAB } from '@/utils/constants.js'
import MoodboardDetailLowerBlockDemander from '@/components/moodboard/MoodboardDetailLowerBlockDemander.vue'
import MoodboardDetailLowerBlockProvider from '@/components/moodboard/MoodboardDetailLowerBlockProvider.vue'
import MoodboardDetailUpperBlock from '@/components/moodboard/MoodboardDetailUpperBlock.vue'
import useNavigation from '@/composables/useNavigation'

const props = defineProps({
  moodboardId: {
    type: Number,
    required: true
  }
})

const { t } = useI18n()
const store = useStore()
const { prefixPath, parsePath } = useNavigation()

const moodboard = computed(() => store.getters['moodboard/moodboard'])
const breadcrumbList = computed(() => {
  return [
    {
      name: t('QQ0001'),
      path: parsePath(`${prefixPath.value}/moodboard`)
    },
    {
      name: moodboard.value.moodboardName,
      path: parsePath(`${prefixPath.value}/moodboard/${props.moodboardId}?tab=${MOODBOARD_TAB.OFFER}`)
    }
  ]
})

await store.dispatch('moodboard/getMoodboard', { moodboardId: props.moodboardId })
</script>

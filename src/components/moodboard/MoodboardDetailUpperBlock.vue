<template lang="pug">
div(class="w-227 mx-auto")
  div(class="mb-7")
    div(class="flex items-center mb-4")
      p(class="text-h4 text-primary font-bold mr-6") {{ moodboard.moodboardName }}
      template(v-if="moodboard.moodboardType === MOODBOARD_TYPE.DEMANDER")
        tooltip(placement="top" class="mr-2")
          template(#trigger)
            div(class="w-7.5 h-7.5 group cursor-pointer hover:bg-brand/10 rounded-full flex items-center justify-center" @click="openCreateOrEditMoodboard")
              svg-icon(iconName="create" class="text-primary group-hover:text-brand" size="24")
          template(#content)
            p(class="text-caption text-primary px-3 py-1 leading-1.6") {{ $t("RR0054") }}
        tooltip(placement="bottom-start" :manual="true" :showArrow="false" :offset="[0, 5]")
          template(#trigger)
            div(class="group w-7.5 h-7.5 flex items-center justify-center cursor-pointer rounded-full hover:bg-brand/10")
              svg-icon(iconName="more_horiz" size="24" class="text-black-700 group-hover:text-brand")
          template(#content)
            list
              list-item(@click.stop="handleDelete") {{ $t("RR0063") }}
    p(class="text-caption text-black-700")
      span {{ $t("RR0066") }}: {{ $dayjs.unix(moodboard.updateDate).format("YYYY/MM/DD") }}
      span(class="mx-1") at
      span {{ $dayjs.unix(moodboard.updateDate).format("h:mm a") }}
  div(class="flex justify-between mb-10")
    div(class="w-110.5")
      div(class="mb-6")
        p(class="text-primary font-bold text-caption mb-4") {{ $t("QQ0007") }}
        div(class="flex items-center")
          img(:src="moodboard.creatorLogo" class="w-6 h-6 rounded-full")
          p(class="text-body2 text-primary ml-2") {{ moodboard.creator }}
      div(class="text-primary")
        p(class="font-bold text-caption mb-4")  {{ $t("RR0014") }}
        p(class="text-body2 leading-1.6") {{ moodboard.description }}
    div(class="w-97.5")
      p(class="text-primary font-bold text-caption mb-4")  {{ $t("QQ0008") }}
      div(class="h-69 bg-black-200 rounded py-6 px-7.5")
        div(class="relative h-full bg-cover bg-center rounded flex items-center justify-center" :style="{ backgroundImage: `url(${moodboard.trendBoardCoverImg})` }")
          p(v-if="!moodboard.trendBoardCoverImg" class="text-body2 leading-1.6 text-black-400") {{ $t("QQ0074") }}
          a(v-else :href="moodboard.trendBoardUrl" target="_blank" class="absolute w-6 h-6 bg-black-0 rounded -bottom-2 -right-3.5 flex items-center justify-center cursor-pointer" style="box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15)")
            svg-icon(iconName="search" size="20" class="text-black-700")
  block-attachment(class="mb-28" :attachmentList="moodboard.attachmentList")
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation.js'
import BlockAttachment from '@/components/moodboard/BlockAttachment.vue'
import { MOODBOARD_TYPE, CREATE_EDIT } from '@/utils/constants.js'

const { t } = useI18n()
const store = useStore()
const { goToMoodboard } = useNavigation()
const moodboard = computed(() => store.getters['moodboard/moodboard'])

const openCreateOrEditMoodboard = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-moodboard',
    properties: {
      mode: CREATE_EDIT.EDIT
    }
  })
}

const handleDelete = () => {
  store.dispatch('helper/openModalConfirm', {
    type: 1,
    header: t('QQ0075'),
    content: t('QQ0076'),
    primaryBtnText: t('UU0105'),
    primaryBtnHandler: () => {
      store.dispatch('moodboard/deleteMoodboard', { moodboardId: moodboard.value.moodboardId })
      goToMoodboard()
      store.commit('helper/PUSH_message', t('QQ0077'))
    },
    textBtnText: t('UU0002')
  })
}
</script>

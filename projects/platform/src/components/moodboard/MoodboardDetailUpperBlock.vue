<template lang="pug">
div(class="w-227 mx-auto pb-13.5")
  div(class="mb-7")
    div(class="flex items-center mb-4")
      p(class="text-h4 text-grey-900 font-bold mr-6") {{ moodboard.moodboardName }}
      template(v-if="moodboard.moodboardType === MOODBOARD_TYPE.DEMANDER")
        f-tooltip-standard(class="mr-2" :tooltipMessage="$t('RR0054')")
          template(#slot:tooltip-trigger)
            div(
              class="w-7.5 h-7.5 group cursor-pointer hover:bg-primary-400/10 rounded-full flex items-center justify-center"
              @click="openCreateOrEditMoodboard"
            )
              f-svg-icon(
                iconName="create"
                class="text-grey-900 group-hover:text-primary-400"
                size="24"
              )
        f-popper(placement="bottom-start")
          template(#trigger)
            div(
              class="group w-7.5 h-7.5 flex items-center justify-center cursor-pointer rounded-full hover:bg-primary-400/10"
            )
              f-svg-icon(
                iconName="more_horiz"
                size="24"
                class="text-grey-600 group-hover:text-primary-400"
                :tooltipMessage="$t('RR0260')"
              )
          template(#content)
            f-list
              f-list-item(@click.stop="handleDelete") {{ $t('RR0063') }}
    p(class="text-caption text-grey-600")
      span {{ $t('RR0066') }}:&nbsp
      span {{ toStandardFormat(moodboard.updateDate) }}
  div(class="flex flex-col justify-between mb-10")
    div(class="mb-6")
      p(class="text-grey-900 font-bold text-caption mb-4") {{ $t('QQ0007') }}
      div(class="flex items-center")
        img(:src="moodboard.creatorLogo" class="w-6 h-6 rounded-full")
        p(class="text-body2 text-grey-900 ml-2") {{ moodboard.creator }}
    div(class="text-grey-900")
      p(class="font-bold text-caption mb-4") {{ $t('RR0014') }}
      p(class="text-body2 leading-1.6 break-words") {{ moodboard.description }}
  block-attachment(class="mb-6" :attachmentList="moodboard.attachmentList")
  div(class="flex flex-col gap-y-4")
    p(class="text-caption text-grey-900 font-bold") {{ $t('RR0249') }}
    trend-board-pdf-viewer(
      :key="moodboard.trendBoardUrl"
      :src="moodboard.trendBoardUrl"
      :name="moodboard.trendBoardFileName"
    )
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import BlockAttachment from '@/components/moodboard/BlockAttachment.vue'
import { MOODBOARD_TYPE, CREATE_EDIT, NOTIFY_TYPE } from '@/utils/constants'
import { toStandardFormat } from '@frontier/lib'
import TrendBoardPdfViewer from './TrendBoardPdfViewer.vue'

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const { goToMoodboard } = useNavigation()
const moodboard = computed(() => store.getters['moodboard/moodboard'])

const openCreateOrEditMoodboard = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-moodboard',
    properties: {
      mode: CREATE_EDIT.EDIT,
    },
  })
}

const handleDelete = () => {
  store.dispatch('helper/openModalConfirm', {
    type: NOTIFY_TYPE.WARNING,
    header: t('QQ0075'),
    contentText: t('QQ0076'),
    primaryBtnText: t('UU0105'),
    primaryBtnHandler: () => {
      store.dispatch('moodboard/deleteMoodboard', {
        moodboardId: moodboard.value.moodboardId,
      })
      goToMoodboard()
      notify.showNotifySnackbar({ messageText: t('QQ0077') })
    },
    textBtnText: t('UU0002'),
  })
}
</script>

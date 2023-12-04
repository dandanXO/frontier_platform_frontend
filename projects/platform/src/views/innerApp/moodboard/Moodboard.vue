<template lang="pug">
div(class="px-8 pt-13 pb-4.5 h-full flex flex-col")
  div(class="mb-8")
    p(class="text-h5 font-bold text-grey-900 mb-3") {{ $t('QQ0001') }}
    p(class="text-body2 text-grey-600") {{ $t('QQ0002') }}
  f-tabs(
    :tabList="tabList"
    :initValue="currentMoodboardType"
    @switch="toggleTab($event.moodboardType)"
    keyField="moodboardType"
  )
  div(class="flex-grow overflow-y-auto")
    div(
      v-if="currentMoodboardType === MoodboardType.DEMANDER"
      class="h-12 flex items-center justify-center text-grey-900 mt-4 rounded-md border border-dashed border-grey-250 cursor-pointer"
      @click="openCreateOrEditMoodboard"
    )
      f-svg-icon(iconName="add" size="16")
      p(class="text-body2 ml-2") {{ $t('QQ0003') }}
    div(v-if="moodboardList.length > 0" class="grid gap-3 mt-4")
      div(
        v-for="moodboard in moodboardList"
        :key="moodboard.moodboardId"
        class="flex h-37.5 rounded overflow-hidden border border-grey-250 cursor-pointer hover:bg-grey-50"
        @click="goToMoodboardDetail({}, moodboard.moodboardId)"
      )
        div(class="w-53 bg-grey-250 flex flex-col items-center justify-center")
          img(
            v-if="moodboard.trendBoard"
            :src="moodboard.trendBoard.thumbnailUrl"
            class="w-full h-full object-cover object-center"
          )
          template(v-else)
            f-svg-icon(iconName="file" size="50" class="text-grey-50 mb-4")
            p(class="text-body2 leading-1.6 text-grey-50") {{ $t('RR0247') }}
        div(class="px-5 pt-6 pb-5 flex flex-col justify-between")
          div
            p(class="leading-1.6 mb-2 font-bold text-body1 text-grey-900") {{ moodboard.moodboardName }}
            div(class="flex items-center")
              img(:src="moodboard.creatorLogo" class="w-5 h-5 rounded-full")
              p(class="text-caption text-grey-600 leading-1.6 ml-1.5") {{ moodboard.creator }}
          div
            span(class="text-caption text-grey-600 leading-1.6 mr-2") {{ $t('RR0066') }}: {{ toStandardFormat(moodboard.updateDate) }}
            span(
              v-if="moodboard.hasNewUpdate"
              class="text-caption text-primary-400 leading-1.6 font-bold"
            ) {{ $t('QQ0005') }}
        f-popper(
          v-if="currentMoodboardType === MoodboardType.DEMANDER"
          placement="bottom-end"
          class="my-auto mr-7 ml-auto"
          @click.stop
        )
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
          template(#content="{ collapsePopper }")
            f-list
              f-list-item(
                @click.stop="handleDelete(moodboard.moodboardId); collapsePopper()"
              ) {{ $t('RR0063') }}
    p(v-else class="mt-29 text-body1 text-grey-900 text-center") {{ $t('QQ0071') }}
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { computed } from 'vue'
import useNavigation from '@/composables/useNavigation'
import { NOTIFY_TYPE } from '@/utils/constants'
import { toStandardFormat } from '@frontier/lib'
import { useMoodboardStore } from '@/stores/moodboard'
import { MoodboardType } from '@frontier/platform-web-sdk'

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const { ogBaseMoodboardApi } = useMoodboardStore()
const { goToMoodboardDetail } = useNavigation()

const { data } = await ogBaseMoodboardApi('getMoodboardList')

const tabList = [
  {
    name: t('QQ0004'),
    moodboardType: MoodboardType.DEMANDER,
  },
  {
    name: t('RR0010'),
    moodboardType: MoodboardType.PROVIDER,
  },
]

const currentMoodboardType = ref(tabList[0].moodboardType)
const moodboardList = computed(() =>
  data.result.moodboardList.filter(
    (moodboard) => moodboard.moodboardType === currentMoodboardType.value
  )
)

const toggleTab = (moodboardType: MoodboardType) => {
  currentMoodboardType.value = moodboardType
}

const openCreateOrEditMoodboard = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-moodboard',
  })
}

const handleDelete = (moodboardId: number) => {
  store.dispatch('helper/openModalConfirm', {
    type: NOTIFY_TYPE.WARNING,
    header: t('QQ0075'),
    contentText: t('QQ0076'),
    primaryBtnText: t('UU0105'),
    primaryBtnHandler: async () => {
      await ogBaseMoodboardApi('deleteMoodboard', { moodboardId })
      store.dispatch('helper/reloadInnerApp')
      notify.showNotifySnackbar({ messageText: t('QQ0077') })
    },
    textBtnText: t('UU0002'),
  })
}
</script>

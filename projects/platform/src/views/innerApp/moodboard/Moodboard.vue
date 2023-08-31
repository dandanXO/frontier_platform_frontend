<template lang="pug">
div(class="px-8 pt-13 pb-4.5 h-full flex flex-col")
  div(class="mb-8")
    p(class="text-h5 font-bold text-grey-900 mb-3") {{ $t('QQ0001') }}
    p(class="text-body2 text-grey-600") {{ $t('QQ0002') }}
  f-tabs(
    :tabList="tabList"
    :initValue="currentTab"
    @switch="toggleTab($event.path)"
  )
  div(class="flex-grow overflow-y-scroll")
    div(
      v-if="currentTab === MOODBOARD_TYPE.DEMANDER"
      class="h-12 flex items-center justify-center text-grey-900 mt-4 rounded-md border border-dashed border-grey-250 cursor-pointer"
      @click="openCreateOrEditMoodboard"
    )
      f-svg-icon(iconName="add" size="16")
      p(class="text-body2 ml-2") {{ $t('QQ0003') }}
    div(v-if="moodboardList.length > 0" class="grid gap-3 mt-4")
      div(
        v-for="moodboard in moodboardList"
        class="flex h-37.5 rounded border border-grey-250 cursor-pointer hover:bg-grey-50"
        @click="goToMoodboardDetail(moodboard.moodboardId)"
      )
        div(
          class="w-53 bg-cover bg-center rounded-l bg-grey-250 flex flex-col items-center justify-center"
          :style="{ backgroundImage: `url(${moodboard.trendBoardCoverImg})` }"
        )
          template(v-if="!moodboard.trendBoardCoverImg")
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
          v-if="currentTab === MOODBOARD_TYPE.DEMANDER"
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

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import useNavigation from '@/composables/useNavigation.js'
import { MOODBOARD_TYPE, CREATE_EDIT, NOTIFY_TYPE } from '@/utils/constants'
import { toStandardFormat } from '@frontier/lib'

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const route = useRoute()
const { goToMoodboardDetail } = useNavigation()

const tabList = [
  {
    name: t('QQ0004'),
    path: MOODBOARD_TYPE.DEMANDER,
  },
  {
    name: t('RR0010'),
    path: MOODBOARD_TYPE.PROVIDER,
  },
]

const currentTab = ref(Number(route.query.tab) || tabList[0].path)
const moodboardList = computed(() =>
  store.getters['moodboard/moodboardList'](Number(currentTab.value))
)

const toggleTab = (tab) => {
  currentTab.value = tab
}

const openCreateOrEditMoodboard = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-moodboard',
    properties: {
      mode: CREATE_EDIT.CREATE,
    },
  })
}

const handleDelete = (moodboardId) => {
  store.dispatch('helper/openModalConfirm', {
    type: NOTIFY_TYPE.WARNING,
    header: t('QQ0075'),
    contentText: t('QQ0076'),
    primaryBtnText: t('UU0105'),
    primaryBtnHandler: () => {
      store.dispatch('moodboard/deleteMoodboard', { moodboardId })
      notify.showNotifySnackbar({ messageText: t('QQ0077') })
    },
    textBtnText: t('UU0002'),
  })
}

await store.dispatch('moodboard/getMoodboardList')
</script>

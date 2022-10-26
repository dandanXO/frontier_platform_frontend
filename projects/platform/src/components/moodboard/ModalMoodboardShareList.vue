<template lang="pug">
modal-behavior(:header="$t('RR0155')")
  div(class="w-94")
    div(class="flex items-end justify-between pb-5 gap-7")
      div(class="text-body2 text-grey-900 flex flex-col justify-between")
        p(class="font-bold pb-2") {{ $t('RR0156') }}
        p(class="leading-normal") {{ $t('RR0150') }}
      f-button(size="sm" class="flex-shrink-0" @click="openModalMoodboardShare") {{ $t('UU0067') }}
    div(class="w-104 h-px bg-grey-100 -mx-5")
    div
      div(class="pt-4 pb-2 flex gap-x-4 items-center text-caption")
        p(class="font-bold text-grey-900") {{ $t('QQ0024') }}
        p(class="text-grey-600") {{ $t('RR0201', { number: shareList.length }) }}
      f-scrollbar-container(class="max-h-67 -mx-4 px-4")
        div(class="grid gap-y-1")
          div(
            v-for="shareTarget in shareList"
            class="group flex items-center h-12 pl-2 pr-4 gap-x-4 hover:bg-grey-100"
          )
            img(
              v-if="shareTarget.logo"
              :src="shareTarget.logo"
              class="w-8 h-8 rounded-full"
            )
            div(v-else class="w-8 h-8 rounded-full border-grey-200 border border-dashed")
            p(class="flex-grow text-body2 text-grey-900 !break-all line-clamp-1") {{ shareTarget.name }} ({{ shareTarget.itemCounts }})
            p(
              class="text-body2 text-red-400 cursor-pointer invisible group-hover:visible"
              @click="removeMoodboardShare(shareTarget)"
            ) {{ $t('UU0016') }}
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

const store = useStore()
const { t } = useI18n()

const shareList = computed(() => store.getters['moodboard/moodboardShareList'])

const openModalMoodboardShare = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-moodboard-share',
  })
}

const removeMoodboardShare = (shareTarget) => {
  store.dispatch('helper/pushModalConfirm', {
    type: 1,
    header: t('QQ0025', { orgName: shareTarget.name }),
    contentText: t('QQ0026', { orgName: shareTarget.name }),
    primaryBtnText: t('UU0097'),
    primaryBtnHandler: async () => {
      store.dispatch('helper/pushModalLoading')
      await store.dispatch('moodboard/removeMoodboardShare', {
        shareId: shareTarget.shareId,
      })
      store.dispatch('helper/closeModalLoading')
      store.dispatch(
        'helper/pushFlashMessage',
        t('QQ0027', { orgName: shareTarget.name })
      )
    },
    textBtnText: t('UU0002'),
  })
}
</script>

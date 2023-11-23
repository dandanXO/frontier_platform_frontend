<template lang="pug">
div(class="w-full flex justify-between items-center h-16")
  template(v-if="shareInfo")
    div(class="flex items-center gap-x-3")
      p(class="text-caption2 md:text-body1 font-bold text-grey-900 pr-2.5") {{ $t('GG0032') }}
      f-avatar(:imageUrl="shareInfo.unitLogo" type="org" size="lg")
      p(class="text-caption2 md:text-body1 font-bold text-grey-900 pl-2.5") {{ shareInfo.unitName }}
    div(class="flex items-center gap-x-6")
      dropdown-locale
      f-tooltip-standard(:tooltipMessage="$t('RR0056')")
        template(#slot:tooltip-trigger)
          f-svg-icon(
            iconName="content_copy"
            class="text-grey-600 hover:text-primary-400 cursor-pointer"
            size="24"
            @click="receivedShareClone([shareInfo.nodeId])"
          )
      div(class="relative cursor-pointer" @click="openModalShareMessage")
        f-svg-icon(iconName="chat" size="24" class="text-grey-600")
        div(
          v-if="haveMsgAndFirstRead"
          class="absolute -top-px -right-px w-2 h-2 rounded-full border border-grey-0 bg-red-400"
        )
      f-button(
        size="md"
        :disabled="shareInfo.isClosed"
        @click="saveReceivedShare"
      ) {{ $t('UU0018') }}
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { computed, ref, onMounted } from 'vue'
import useReceivedShare from '@/composables/useReceivedShare.js'
import DropdownLocale from '@/components/common/DropdownLocale.vue'
import useLogSender from '@/composables/useLogSender'
import { useReceivedShareStore } from '@/stores/receivedShare'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  sharingKey: string
}>()

const store = useStore()
const logSender = useLogSender()
logSender.createReceivePageLog(props.sharingKey)
const receivedShareStore = useReceivedShareStore()
const { getReceivedShareInfo, setHasSelectedStickerAddFromOG } =
  receivedShareStore
const { shareInfo, hasLogin, hasSelectedStickerAddFromOG } =
  storeToRefs(receivedShareStore)
const { saveReceivedShare, receivedShareClone } = useReceivedShare()

const isFirstTime = ref(true)
const haveMsgAndFirstRead = computed(
  () => shareInfo.value?.message && isFirstTime.value
)

const openModalShareMessage = () => {
  isFirstTime.value = false
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-share-message',
    properties: {
      message: shareInfo.value?.message,
    },
  })
}

const isStickerDrawerForLoginOpen = computed<boolean>(
  () => store.getters['sticker/isStickerDrawerForLoginOpen']
)

onMounted(async () => {
  await getReceivedShareInfo(props.sharingKey)

  if (!shareInfo.value) {
    return
  }

  if (
    hasLogin.value &&
    isStickerDrawerForLoginOpen.value &&
    !hasSelectedStickerAddFromOG.value
  ) {
    store.commit('sticker/SET_isStickerDrawerForLoginOpen', false)
    // 檢查是否有選擇過組織
    setTimeout(() => {
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-choose-sticker-add-from',
        properties: {
          actionHandler: async (orgNo: string) => {
            store.dispatch('helper/openModalLoading')
            await store.dispatch('organization/getOrg', { orgNo })
            setHasSelectedStickerAddFromOG(true)
            await Promise.all([
              store.dispatch('organization/orgUser/getOrgUser'),
              store.dispatch('sticker/openStickerDrawer', {
                materialId: store.getters['sticker/currentMaterialId'],
                drawerOpenFromLocationList:
                  store.getters['sticker/drawerOpenFromLocationList'],
                drawerOpenFromLocationType:
                  store.getters['sticker/drawerOpenFromLocationType'],
              }),
            ])
            store.dispatch('helper/closeModalLoading')
          },
        },
      })
    }, 0)
  }
})
</script>

<template lang="pug">
div(class="relative w-full rounded-md shadow-8 overflow-hidden")
  div(
    class="absolute top-0 left-0 w-1 h-full"
    :class="{ 'bg-forestgreen-300': addTo === EXTERNAL, 'bg-grey-300': addTo === INTERNAL }"
  )
  div(class="px-5 py-3 bg-grey-0")
    div(class="flex items-center justify-between")
      sticker-label-add-to(:addTo="addTo")
      f-svg-icon(
        iconName="clear"
        size="20"
        class="text-grey-600 cursor-pointer"
        @click="$emit('close')"
      )
    div(class="pt-2.5 pl-1 flex flex-col gap-y-3")
      //- Add From
      div(v-if="canChooseAddFrom" class="h-9 flex items-center gap-x-1.5")
        div(class="w-17.5 flex items-center gap-x-1")
          p(class="text-caption text-grey-900") {{ $t('TT0006') }}
          f-svg-icon(
            iconName="info_outline"
            size="14"
            class="text-grey-300 hover:text-grey-600"
            :tooltipMessage="$t('TT0015')"
          )
        f-select-dropdown(
          class="w-73.5"
          v-model:selectValue="addFrom"
          :dropdownMenuTree="menuAddFrom"
          size="md"
        )
      //- Add To
      div(class="flex flex-col gap-y-1.5")
        div(class="w-full flex items-center gap-x-1.5")
          p(class="w-17.5 text-caption text-grey-900") {{ $t('TT0007') }}
          div(
            class="flex-grow h-7 bg-grey-150 grid grid-cols-2 items-center justify-items-center rounded-sm"
          )
            f-tooltip-standard(
              :tooltipMessage="!canChooseAddToExternal ? $t('TT0111') : ''"
            )
              template(#slot:tooltip-trigger)
                div(
                  class="w-35 h-5.5 flex items-center justify-center gap-x-1.5"
                  :class="[{ 'bg-grey-0 rounded-sm': addTo === EXTERNAL }, !canChooseAddToExternal ? 'text-grey-200' : 'text-grey-900']"
                  @click="canChooseAddToExternal && (addTo = EXTERNAL)"
                )
                  f-svg-icon(iconName="external" size="14")
                  p(class="text-caption") {{ $t('TT0009') }}
            div(
              class="w-35 h-5.5 flex items-center justify-center gap-x-1.5 text-grey-900"
              :class="{ 'bg-grey-0 rounded-sm': addTo === INTERNAL }"
              @click="addTo = INTERNAL"
            )
              f-svg-icon(iconName="internal" size="14")
              p(class="text-caption") {{ $t('TT0010') }}
        p(class="w-73.5 self-end text-grey-300 text-caption leading-1.6") {{ addTo === EXTERNAL ? $t('TT0018', { addFrom: addFrom.addFromOGType === OG_TYPE.ORG ? $t('RR0262') : $t('RR0263') }) : $t('TT0030', { addFrom: addFrom.addFromOGType === OG_TYPE.ORG ? $t('RR0262') : $t('RR0263') }) }}
      //- Type
      div(v-if="addTo === EXTERNAL" class="h-7 flex items-center gap-x-1.5")
        p(class="w-17.5 text-caption text-grey-900") {{ $t('TT0008') }}
        div(class="flex-grow flex items-center gap-x-8")
          template(v-for="item in STICKER_TYPE")
            p(v-if="item.value === type" class="text-body2 text-grey-900 font-bold") {{ item.text }}
            f-tooltip-standard(v-else :tooltipMessage="$t('TT0093')")
              template(#slot:tooltip-trigger)
                p(class="text-body2 text-grey-200") {{ item.text }}
  div(class="px-5 pb-2.5 bg-grey-100")
    div(class="min-h-25 py-4 box-content")
      common-sticker-text-editor(
        ref="refStickerTextEditor"
        v-model:content="content"
        :addTo="addTo"
      )
    sticker-tag-input(
      ref="refStickerTagInput"
      v-model:inputTagList="tagList"
      class="mb-2"
    )
    common-sticker-text-editor-footer(
      v-model:tagList="tagList"
      :addTo="addTo"
      :addFrom="addFrom"
      :addButtonDisabled="content.length === 0"
      @mentionTrigger="() => refStickerTextEditor.mentionPerson()"
      @tagInputTrigger="() => refStickerTagInput.focus()"
      @addButtonClick="createStickerOrDigitalThread"
    )
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { STICKER_ADD_TO, OG_TYPE, LOCATION_TYPE } from '@/utils/constants'
import useStickerAddFromMenu from '@/composables/useStickerAddFromMenu'
import StickerLabelAddTo from '@/components/sticker/StickerLabelAddTo.vue'
import StickerTagInput from '@/components/sticker/StickerTagInput.vue'
import CommonStickerTextEditor from '@/components/sticker/stickerTextEditor/CommonStickerTextEditor.vue'
import CommonStickerTextEditorFooter from '@/components/sticker/stickerTextEditor/CommonStickerTextEditorFooter.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const { EXTERNAL, INTERNAL } = STICKER_ADD_TO

const tempCreatingStickerId = uuidv4()

const emit = defineEmits(['close'])
const props = defineProps({
  // 當 digital thread (全新) 要建立第一筆 sticker 時為 true
  isCreatingDigitalThread: {
    default: false,
  },
  digitalThreadName: {
    type: String,
    required: true,
  },
})
const { t } = useI18n()
const store = useStore()

const menuAddFrom = useStickerAddFromMenu()

const STICKER_TYPE = {
  TEXT_ONLY: {
    text: t('TT0011'),
    value: 1,
  },
  REQUEST: {
    text: t('TT0012'),
    value: 2,
  },
  PERMISSION: {
    text: t('TT0013'),
    value: 3,
  },
}

const canChooseAddFrom = computed(() => {
  const drawerOpenFromLocationType =
    store.getters['sticker/drawerOpenFromLocationType']
  const { ASSETS, WORKSPACE, NOTIFICATION } = LOCATION_TYPE

  return (
    props.isCreatingDigitalThread &&
    !(
      [ASSETS, WORKSPACE].includes(drawerOpenFromLocationType) &&
      drawerOpenFromLocationType !== NOTIFICATION
    )
  )
})
// form data of creating digit thread or sticker
const getDefaultAddFrom = () => {
  const menuItem = menuAddFrom.value.blockList[0].menuList.find((menu) => {
    const { addFromOGId, addFromOGType } = menu.selectValue
    let ogType, ogId

    if (!props.isCreatingDigitalThread) {
      const { sideOGId, sideOGType } = store.getters['sticker/digitalThread']
      ogType = sideOGType
      ogId = sideOGId
    } else {
      ogType =
        store.getters['helper/routeLocation'] === 'org'
          ? OG_TYPE.ORG
          : OG_TYPE.GROUP
      ogId = store.getters['helper/routeLocationId']
    }

    return addFromOGType === ogType && addFromOGId === ogId
  })
  return menuItem.selectValue
}
const addFrom = ref(getDefaultAddFrom())

const canChooseAddToExternal = computed(() => {
  const { materialOwnerOGId, materialOwnerOGType } =
    store.getters['sticker/material']
  const isSameUnit =
    addFrom.value.addFromOGType === materialOwnerOGType &&
    addFrom.value.addFromOGId === materialOwnerOGId

  if (props.isCreatingDigitalThread) {
    const drawerOpenFromLocationType =
      store.getters['sticker/drawerOpenFromLocationType']
    const { ASSETS } = LOCATION_TYPE

    if (drawerOpenFromLocationType === ASSETS) {
      return false
    }

    if (drawerOpenFromLocationType !== ASSETS && isSameUnit) {
      return false
    }
  }

  if (
    !props.isCreatingDigitalThread &&
    isSameUnit &&
    store.getters['sticker/digitalThread'].stickerStatistics.externalQty === 0
  ) {
    return false
  }

  return true
})

const addTo = ref(canChooseAddToExternal.value ? EXTERNAL : INTERNAL)
const type = ref(STICKER_TYPE.TEXT_ONLY.value)
const content = ref('')
const tagList = ref([])

const createStickerOrDigitalThread = async () => {
  if (props.isCreatingDigitalThread) {
    await store.dispatch('sticker/createDigitalThread', {
      digitalThreadName: props.digitalThreadName,
      addFromOGId: addFrom.value.addFromOGId,
      addFromOGType: addFrom.value.addFromOGType,
      addTo: addTo.value,
      type: type.value,
      content: content.value,
      tagList: tagList.value,
    })
  } else {
    await store.dispatch('sticker/createSticker', {
      addTo: addTo.value,
      type: type.value,
      content: content.value,
      tagList: tagList.value,
    })
  }

  emit('close')
}

const refStickerTextEditor = ref(null)
const refStickerTagInput = ref(null)

if (props.isCreatingDigitalThread) {
  watch(
    () => addFrom.value,
    () => {
      const { addFromOGId: ogId, addFromOGType: ogType } = addFrom.value
      store.dispatch('sticker/getStickerTagList', {
        ogId,
        ogType,
      })
      store.dispatch('sticker/getMentionMemberList', {
        ogId,
        ogType,
      })
      if (!canChooseAddToExternal.value) {
        addTo.value = INTERNAL
      }
    },
    {
      immediate: true,
    }
  )
}

watch(content, (contentValue) => {
  if (contentValue) {
    store.dispatch('sticker/addTempCreateStickerId', tempCreatingStickerId)
  } else {
    store.dispatch('sticker/removeTempCreateStickerId', tempCreatingStickerId)
  }
})

onUnmounted(() => {
  store.dispatch('sticker/removeTempCreateStickerId', tempCreatingStickerId)
})
</script>

<template lang="pug">
div(class="relative w-full rounded-md drop-shadow-8 overflow-hidden")
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
      div(
        v-if="isCreatingDigitalThread && !isInternalLocation"
        class="h-9 flex items-center gap-x-1.5"
      )
        div(class="w-17.5 flex items-center gap-x-1")
          p(class="text-caption text-grey-900") {{ $t('TT0006') }}
          f-svg-icon(
            iconName="info_outline"
            size="14"
            class="text-grey-300 hover:text-grey-600"
            :tooltip="$t('TT0015')"
          )
        f-input-select(
          class="w-73.5"
          v-model:selectValue="addFrom"
          :dropdownMenuTree="menuAddFrom"
          size="md"
        )
      //- Add To
      div(class="h-13 flex flex-col")
        div(class="w-full flex items-center gap-x-1.5")
          p(class="w-17.5 text-caption text-grey-900") {{ $t('TT0007') }}
          div(
            class="flex-grow h-7 bg-grey-150 grid grid-cols-2 items-center justify-items-center rounded-sm"
          )
            f-tooltip
              template(#trigger)
                div(
                  class="w-35 h-5.5 flex items-center justify-center gap-x-1.5"
                  :class="[{ 'bg-grey-0 rounded-sm': addTo === EXTERNAL }, isInternalLocation ? 'text-grey-200' : 'text-grey-900']"
                  @click="!isInternalLocation && (addTo = EXTERNAL)"
                )
                  f-svg-icon(iconName="external" size="14")
                  p(class="text-caption") {{ $t('TT0009') }}
              template(v-if="isInternalLocation" #content)
                p {{ $t('TT0111') }}
            div(
              class="w-35 h-5.5 flex items-center justify-center gap-x-1.5 text-grey-900"
              :class="{ 'bg-grey-0 rounded-sm': addTo === INTERNAL }"
              @click="addTo = INTERNAL"
            )
              f-svg-icon(iconName="internal" size="14")
              p(class="text-caption") {{ $t('TT0010') }}
        div(class="w-73.5 self-end text-grey-300 flex items-center gap-x-2")
          f-svg-icon(
            :iconName="addTo === EXTERNAL ? 'visibility' : 'internal'"
            size="14"
          )
          p(class="text-caption leading-1.6") {{ addTo === EXTERNAL ? $t('TT0018') : $t('TT0030') }}
      //- Type
      div(v-if="addTo === EXTERNAL" class="h-7 flex items-center gap-x-1.5")
        p(class="w-17.5 text-caption text-grey-900") {{ $t('TT0008') }}
        div(class="flex-grow flex items-center gap-x-8")
          template(v-for="item in STICKER_TYPE")
            p(v-if="item.value === type" class="text-body2 text-grey-900 font-bold") {{ item.text }}
            f-tooltip(v-else)
              template(#trigger)
                p(class="text-body2 text-grey-200") {{ item.text }}
              template(#content)
                p {{ $t('TT0093') }}
  div(class="min-h-45 px-5 pb-2.5 bg-grey-100")
    div(class="min-h-25 py-4 box-content")
      sticker-text-editor(
        ref="refStickerTextEditor"
        v-model:content="content"
        :addTo="addTo"
      )
    sticker-tag-input(
      ref="refStickerTagInput"
      v-model:inputTagList="tagList"
      class="mb-2"
    )
    div(class="flex items-center h-9.5")
      div(class="flex-grow pr-3.5 flex items-center gap-x-3")
        f-avatar(
          :imageUrl="avatar"
          :type="addTo === EXTERNAL ? 'org' : 'user'"
          :labelColor="organization.labelColor"
          size="sm"
        )
        div(class="w-50")
          p(class="font-bold text-grey-900 text-caption leading-1.6 truncate") {{ organization.orgName }}
          p(v-if="addTo === INTERNAL" class="pt-1 text-grey-800 text-caption") {{ orgUser.displayName }}
      div(
        class="flex-shrink-0 w-7 h-7 bg-grey-0 border border-grey-150 flex items-center justify-center rounded mr-1.5"
        @click="refStickerTextEditor.mentionPerson"
        :class="[addTo === EXTERNAL ? 'text-grey-150 pointer-events-none' : 'text-grey-900 cursor-pointer']"
      )
        f-svg-icon(iconName="mention" size="16")
      div(
        class="flex-shrink-0 w-7 h-7 bg-grey-0 border border-grey-150 flex items-center justify-center rounded mr-4 cursor-pointer"
        @click="refStickerTagInput.focus"
      )
        f-svg-icon(
          iconName="tag"
          size="16"
          class="text-grey-900"
          :tooltip="$t('TT0053')"
        )
      f-button(
        size="sm"
        :disabled="content.length === 0"
        @click="createStickerOrDigitalThread"
      ) {{ $t('UU0035') }}
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { STICKER_ADD_TO, OG_TYPE, LOCATION_TYPE } from '@/utils/constants'
import StickerLabelAddTo from '@/components/sticker/StickerLabelAddTo.vue'
import StickerTagInput from '@/components/sticker/StickerTagInput.vue'
import StickerTextEditor from '@/components/sticker/stickerTextEditor/StickerTextEditor.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const { EXTERNAL, INTERNAL } = STICKER_ADD_TO

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

const organization = computed(() => store.getters['organization/organization'])
const menuAddFrom = computed(() => {
  const { orgName, orgId, labelColor } = organization.value

  return {
    width: 'w-73.5',
    blockList: [
      {
        menuList: [
          {
            title: orgName,
            selectValue: {
              addFromOGId: orgId,
              addFromOGType: OG_TYPE.ORG,
            },
            labelColor,
          },
          ...store.getters['organization/groupList'].map((group) => {
            const { groupId, groupName, labelColor } = group
            return {
              title: groupName,
              selectValue: {
                addFromOGId: groupId,
                addFromOGType: OG_TYPE.GROUP,
              },
              labelColor,
            }
          }),
        ],
      },
    ],
  }
})
const orgUser = computed(() => store.getters['organization/orgUser/orgUser'])
const avatar = computed(() => {
  return addTo.value === EXTERNAL
    ? organization.value.logo
    : orgUser.value.avatar
})

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

const isInternalLocation = computed(() =>
  [LOCATION_TYPE.ASSETS, LOCATION_TYPE.WORKSPACE].includes(
    store.getters['sticker/addFromLocationType']
  )
)

// form data of creating digit thread or sticker
const addFrom = ref(menuAddFrom.value.blockList[0].menuList[0].selectValue)
const addTo = ref(isInternalLocation.value ? INTERNAL : EXTERNAL)
const type = ref(STICKER_TYPE.TEXT_ONLY.value)
const content = ref('')
const tagList = ref([])

const routeLocation = computed(() => store.getters['helper/routeLocation'])
const routeLocationId = computed(() => store.getters['helper/routeLocationId'])

if (routeLocation.value === 'org') {
  addFrom.value = {
    addFromOGType: OG_TYPE.ORG,
    addFromOGId: routeLocationId.value,
  }
} else {
  addFrom.value = {
    addFromOGType: OG_TYPE.GROUP,
    addFromOGId: routeLocationId.value,
  }
}

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
      store.dispatch('sticker/getStickerTagList', addFrom.value)
      store.dispatch('sticker/getMentionMemberList', {
        ogId: addFrom.value.addFromOGId,
        ogType: addFrom.value.addFromOGType,
      })
    },
    {
      immediate: true,
    }
  )
}
</script>

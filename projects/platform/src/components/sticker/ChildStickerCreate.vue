<template lang="pug">
div(class="relative w-full overflow-hidden")
  div(class="flex items-center justify-between")
    div(class="flex items-center gap-x-1 text-grey-300")
      f-svg-icon(iconName="sticker")
      span(class="text-caption") {{ `#${order}` }}
    f-svg-icon(
      iconName="clear"
      size="20"
      class="text-grey-600 cursor-pointer"
      @click="emit('close')"
    )
  div(class="min-h-45 pb-2.5")
    div(class="min-h-25 pt-2.5 pb-2 box-content")
      common-sticker-text-editor(
        ref="refChildStickerTextEditor"
        v-model:content="content"
        :stickerId="stickerId"
        :addTo="addTo"
        @close="emit('close')"
      )
    sticker-tag-input(
      ref="refChildStickerTagInput"
      v-model:inputTagList="tagList"
      class="mb-2"
    )
    common-sticker-text-editor-footer(
      v-model:tagList="tagList"
      :addTo="addTo"
      :addButtonDisabled="content.length === 0"
      @mentionTrigger="() => refChildStickerTextEditor.mentionPerson()"
      @tagInputTrigger="() => refChildStickerTagInput.focus()"
      @addButtonClick="createChildSticker"
    )
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { OG_TYPE } from '@/utils/constants'
import StickerTagInput from '@/components/sticker/StickerTagInput.vue'
import CommonStickerTextEditor from '@/components/sticker/stickerTextEditor/CommonStickerTextEditor.vue'
import CommonStickerTextEditorFooter from '@/components/sticker/stickerTextEditor/CommonStickerTextEditorFooter.vue'
import { useStore } from 'vuex'

const tempCreatingStickerId = uuidv4()

const emit = defineEmits('close')
const props = defineProps({
  order: {
    type: Number,
    required: true,
  },
  stickerId: {
    type: Number,
    required: true,
  },
  addTo: {
    type: Number,
    required: true,
  },
})
const store = useStore()

const refChildStickerTextEditor = ref()

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

// form data of creating digit thread or sticker
const addFrom = ref(menuAddFrom.value.blockList[0].menuList[0].selectValue)
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

const refChildStickerTagInput = ref(null)

const createChildSticker = async () => {
  await store.dispatch('sticker/createChildSticker', {
    stickerId: props.stickerId,
    content: content.value,
    tagList: tagList.value,
  })
  emit('close')
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

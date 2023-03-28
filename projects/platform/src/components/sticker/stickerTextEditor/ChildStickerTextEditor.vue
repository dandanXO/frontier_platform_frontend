<template lang="pug">
div(v-if="editor")
  editor-content(:editor="editor" @keydown.space.stop)
  div(class="flex items-center justify-end gap-x-2 pt-2")
    f-button(type="text" size="sm" @click="$emit('close')") {{ $t('UU0002') }}
    f-button(
      size="sm"
      :disabled="content.length === 0"
      @click="createChildSticker"
    ) {{ $t('UU0035') }}
</template>

<script setup>
import { ref, onUnmounted, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document' // https://tiptap.dev/api/nodes/document
import Paragraph from '@tiptap/extension-paragraph' // https://tiptap.dev/api/nodes/paragraph
import Text from '@tiptap/extension-text' // https://tiptap.dev/api/nodes/text
import Placeholder from '@tiptap/extension-placeholder' // https://tiptap.dev/api/extensions/placeholder
// https://tiptap.dev/api/nodes/mention#render-label
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

const tempCreatingStickerId = uuidv4()

const store = useStore()
const { t } = useI18n()
const emit = defineEmits('close')
const props = defineProps({
  stickerId: {
    type: Number,
    required: true,
  },
})

const content = ref('')

const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Text,
    Placeholder.configure({
      placeholder: t('TT0014'),
    }),
  ],
  editorProps: {
    attributes: {
      class:
        'outline-none border border-grey-200 bg-grey-0 rounded min-h-25 px-3 py-1.5 text-body2 leading-1.6 text-grey-900',
    },
  },
  onUpdate: () => {
    content.value = editor.value.isEmpty
      ? ''
      : JSON.stringify(editor.value.getJSON())
  },
})
onUnmounted(() => {
  editor.value.destroy()
})

const createChildSticker = async () => {
  await store.dispatch('sticker/createChildSticker', {
    stickerId: props.stickerId,
    content: content.value,
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

<template lang="pug">
editor-content(v-if="editor" :editor="editor" @keydown.space.stop)
</template>

<script setup>
import { computed } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document' // https://tiptap.dev/api/nodes/document
import Paragraph from '@tiptap/extension-paragraph' // https://tiptap.dev/api/nodes/paragraph
import Text from '@tiptap/extension-text' // https://tiptap.dev/api/nodes/text
import { CustomMention as Mention } from '@/components/sticker/stickerTextEditor/customMention.js'
import suggestion from '@/components/sticker/stickerTextEditor/suggestion.js'
// https://tiptap.dev/api/nodes/mention#render-label
import { STICKER_ADD_TO } from '@/utils/constants.js'
const { EXTERNAL, INTERNAL } = STICKER_ADD_TO

const props = defineProps({
  addTo: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
})

const memberList = computed(() => [
  {
    userId: 1,
    name: 'Yuki',
  },
  {
    userId: 2,
    name: 'Mia',
  },
  {
    userId: 3,
    name: 'Walle',
  },
])

const suggestionList = computed(() =>
  props.addTo === INTERNAL ? memberList.value : []
)

const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Text,
    Mention.configure({
      HTMLAttributes: {
        class: 'font-bold text-primary-400',
      },
      suggestion: suggestion(suggestionList),
    }),
  ],
  editorProps: {
    attributes: {
      class: 'outline-none bg-grey-0 text-body2 leading-1.6 text-grey-900',
    },
  },
  editable: false,
  content: JSON.parse(props.content),
})
</script>

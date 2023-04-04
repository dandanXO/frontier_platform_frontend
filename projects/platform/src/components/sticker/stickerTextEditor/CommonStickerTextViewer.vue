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
import { useStore } from 'vuex'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  editorClass: {
    type: String,
  },
})

const store = useStore()

const suggestionList = computed(
  () => store.getters['sticker/digitalThread'].participantAndMentionList
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
      suggestion: suggestion(
        computed(() => true),
        suggestionList
      ),
    }),
  ],
  editorProps: {
    attributes: {
      class: props.editorClass,
    },
  },
  editable: false,
  content: JSON.parse(props.content),
})
</script>

<template lang="pug">
editor-content(v-if="editor" :editor="editor" @keydown.space.stop)
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document' // https://tiptap.dev/api/nodes/document
import Paragraph from '@tiptap/extension-paragraph' // https://tiptap.dev/api/nodes/paragraph
import Text from '@tiptap/extension-text' // https://tiptap.dev/api/nodes/text

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})

const editor = useEditor({
  extensions: [Document, Paragraph, Text],
  editorProps: {
    attributes: {
      class: 'outline-none text-body2 leading-1.6 text-grey-900',
    },
  },
  editable: false,
  content: JSON.parse(props.content),
})
</script>

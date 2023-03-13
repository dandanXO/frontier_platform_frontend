<template lang="pug">
editor-content(v-if="editor" :editor="editor" @keydown.space.stop)
</template>

<script setup>
import { watch, computed, onUnmounted } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document' // https://tiptap.dev/api/nodes/document
import Paragraph from '@tiptap/extension-paragraph' // https://tiptap.dev/api/nodes/paragraph
import Text from '@tiptap/extension-text' // https://tiptap.dev/api/nodes/text
import Placeholder from '@tiptap/extension-placeholder' // https://tiptap.dev/api/extensions/placeholder
import { CustomMention as Mention } from '@/components/sticker/stickerTextEditor/customMention.js'
import suggestion from '@/components/sticker/stickerTextEditor/suggestion.js'
// https://tiptap.dev/api/nodes/mention#render-label
import { STICKER_ADD_TO } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
const { EXTERNAL, INTERNAL } = STICKER_ADD_TO

const { t } = useI18n()
const store = useStore()

const props = defineProps({
  addTo: {
    type: Number,
    required: true,
  },
  // v-model:content
  content: {
    type: String,
    required: true,
  },
})
const emits = defineEmits(['update:content'])

const innerContent = computed({
  get: () => props.content,
  set: (v) => emits('update:content', v),
})

const suggestionList = computed(
  () => store.getters['sticker/mentionMemberList']
)
const isMentionable = computed(() => props.addTo === INTERNAL)

const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Text,
    Mention.configure({
      HTMLAttributes: {
        class: 'font-bold text-primary-400',
      },
      suggestion: suggestion(isMentionable, suggestionList),
    }),
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
  content:
    innerContent.value.length !== 0 ? JSON.parse(innerContent.value) : '',
  onUpdate: () => {
    innerContent.value = editor.value.isEmpty
      ? ''
      : JSON.stringify(editor.value.getJSON())
  },
})
onUnmounted(() => {
  editor.value.destroy()
})

watch(
  () => props.addTo,
  (newValue, oldValue) => {
    if (oldValue === INTERNAL && newValue === EXTERNAL) {
      const transferToNoMention = (contentList) => {
        let newContentList = []
        let i = 0
        while (i < contentList.length) {
          const content = contentList[i]
          if (content.type === 'mention') {
            i++
            const name = suggestionList.value.find(
              (member) => member.userId === content.attrs.userId
            ).name
            newContentList.push({
              type: 'text',
              text: name + contentList[i].text,
            })
          } else {
            newContentList.push(content)
          }
          i++
        }

        return newContentList
      }

      const transferredContent = editor.value.getJSON()
      transferredContent.content = transferredContent.content.map((item) => {
        if (item.content) {
          item.content = transferToNoMention(item.content)
        }
        return item
      })

      setContent(transferredContent)
    }
  }
)

const setContent = (content) => {
  editor.value.commands.setContent(content)
  innerContent.value = JSON.stringify(content)
}

const mentionPerson = () => {
  props.addTo === INTERNAL && editor.value.commands.insertContent(' @')
}

defineExpose({
  mentionPerson,
})
</script>

<style lang="scss">
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  pointer-events: none;
  height: 0;
  @apply text-grey-200 text-body2 leading-1.6;
}
</style>

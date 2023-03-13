// https://github.com/ueberdosis/tiptap/issues/1316#issuecomment-851518606
// https://codesandbox.io/s/bold-voice-l58oq?file=/src/customMention.js

import { mergeAttributes } from '@tiptap/core'
import Mention from '@tiptap/extension-mention' // https://tiptap.dev/api/nodes/mention

export const CustomMention = Mention.extend({
  addAttributes() {
    return {
      userId: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.userId) {
            return {}
          }

          return {
            'data-mention-user-id': attributes.userId,
          }
        },
        parseHTML: (element) => {
          return element.getAttribute('data-mention-user-id')
        },
      },
    }
  },
  renderHTML({ node, HTMLAttributes }) {
    const { sourceItems, char } = this.options.suggestion // type of sourceItem is ComputedRef
    const name = sourceItems.value.find(
      ({ userId }) => Number(userId) === Number(node.attrs.userId)
    )?.name

    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      `${char}${name}`,
    ]
  },
  parseHTML() {
    return [
      {
        tag: 'span[data-mention-user-id]',
      },
    ]
  },
})

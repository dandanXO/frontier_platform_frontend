import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'

import MentionList from '@/components/sticker/stickerTextEditor/MentionList.vue'

/**
 * @param {ComputedRef} mentionItemList
 */
export default (mentionItemList = []) => ({
  // add `sourceItems` to suggestion instance so that it can be access in renderHTML which is hook of Mention
  sourceItems: mentionItemList,
  items: ({ query }) => {
    return mentionItemList.value.filter(({ name }) =>
      name.toLowerCase().startsWith(query.toLowerCase())
    )
  },

  render: () => {
    let component
    let popup

    return {
      onStart: (props) => {
        component = new VueRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'top-start',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
})

import { h, shallowRef } from 'vue'
import { Translation } from 'vue-i18n'

export const getBoldInterpolationMessageComponent = (
  keypath: string,
  interpolations: Record<string, string> = {}
) => {
  return shallowRef({
    render: () => {
      return h('div', [
        h(
          Translation,
          { keypath, tag: 'p', scope: 'global' },
          Object.entries(interpolations).reduce((result, entry) => {
            return {
              ...result,
              [entry[0]]: () => h('span', { class: 'font-bold' }, entry[1]),
            }
          }, {})
        ),
      ])
    },
  })
}

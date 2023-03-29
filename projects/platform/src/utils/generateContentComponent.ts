import { h } from 'vue'
import { LOCATION_TYPE, CONTENT_PARSED_TYPE } from '@/utils/constants'
import store from '@/store'

interface ContentValue {
  type: CONTENT_PARSED_TYPE
  text: string
  value: string
}

/**
 * 將 content 字串中的 {x} 替換成 contentValue item 中的 value (x 為數字並對應到 contentValue 的 index)，
 * 其中 type 的型別可參考 CONTENT_PARSED_TYPE 1 為一般 url 連結，2 為 sticker drawer 連結，
 * 並且函式會回傳一個 Vue 3 的 render 函式
 */
export default (
  content: string,
  contentValue: ContentValue[],
  textClasses: string[],
  linkClasses: string[]
) => {
  const re = new RegExp(/\{\d+\}/, 'g')
  const matches = [...content.matchAll(re)]
  const pairIndexList: [number, number][] = []
  let i = 0

  if (matches.length !== 0) {
    for (const match of matches) {
      const index = match.index as number
      pairIndexList.push([i, index])
      pairIndexList.push([index, index + 3])
      i = index + 3
    }
  }

  pairIndexList.push([i, content.length])

  return {
    render: () => {
      return h(
        'p',
        {
          class: textClasses,
        },
        ...pairIndexList
          .filter(([start, end]) => start !== end)
          .map(([start, end]) => {
            const fragment = content.slice(start, end)
            if (fragment.match(re)) {
              const index = Number(fragment.slice(1, fragment.length - 1))
              const { type, text, value } = contentValue[index]
              if (type === CONTENT_PARSED_TYPE.URL) {
                return h(
                  'a',
                  {
                    class: linkClasses,
                    href: value,
                    target: '_blank',
                  },
                  text
                )
              }
              if (type === CONTENT_PARSED_TYPE.STICKER) {
                return h(
                  'span',
                  {
                    class: linkClasses,
                    onClick: () => {
                      store.dispatch('sticker/openStickerDrawer', {
                        digitalThreadSideId: value,
                        drawerOpenFromLocationType: LOCATION_TYPE.NOTIFICATION,
                      })
                    },
                  },
                  text
                )
              }
            }
            return h('span', {}, fragment)
          })
      )
    },
  }
}

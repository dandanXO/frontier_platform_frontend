import { computed, unref, type Ref } from "vue"

const useBadgeCountDisplay = (count: Ref<number> | number) => {
  return computed(() => {
    if (unref(count) < 100) {
      return unref(count)
    }

    return '99+'
  })
}

export default useBadgeCountDisplay

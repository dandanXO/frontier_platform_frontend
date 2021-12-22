<template lang="pug">
div(class="flex text-black-700 cursor-pointer")
  div(
    class="py-1 px-1.5 border-t-2 border-b-2 border-l-2 rounded-l"
    :class="[displayMode === DISPLAY_NODE.GRID ? `${activeClass} border-r-2` : '']"
    @click="displayMode = DISPLAY_NODE.GRID"
  )
    svg-icon(iconName="apps" size="24")
  div(
    class="py-1 px-1.5 border-t-2 border-b-2 border-r-2 rounded-r"
    :class="[displayMode === DISPLAY_NODE.LIST ? `${activeClass} border-l-2` : '']"
    @click="displayMode = DISPLAY_NODE.LIST"
  )
    svg-icon(iconName="format_list_bulleted" size="24")
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { DISPLAY_NODE } from '@/utils/constants.js'

export default {
  name: 'GridOrRow',
  setup () {
    const store = useStore()
    const displayMode = computed({
      get: () => store.getters['assets/displayMode'],
      set: (v) => store.dispatch('assets/updateDisplayMode', v)
    })
    const activeClass = 'text-brand border-brand bg-brand-light'

    return {
      activeClass,
      displayMode,
      DISPLAY_NODE
    }
  }
}
</script>

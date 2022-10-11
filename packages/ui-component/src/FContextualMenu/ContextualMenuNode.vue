<template lang="pug">
f-tooltip(v-if="innerMenu.tooltip && innerMenu.disabled" isNotFitWidth)
  template(#trigger)
    f-list-item(:disabled="innerMenu.disabled") {{ innerMenu.title }}
  template(#content)
    p {{ innerMenu.tooltip }}
f-list-item(
  v-else
  class="min-w-57.5"
  :class="{ 'bg-grey-100': isSelect }"
  :disabled="innerMenu.disabled"
  @mouseleave="hasNextLevel && collapseMenu()"
  @click.stop="clickMenuHandler"
)
  div(
    ref="refTrigger"
    aria-describedby="contextual-menu"
    @mouseenter="hasNextLevel && expandMenu()"
    class="w-full flex items-center"
  )
    f-svg-icon(v-if="innerMenu.icon" :iconName="innerMenu.icon" size="20" class="text-grey-600 mr-2")
    img(v-if="innerMenu.thumbnail" :src="innerMenu.thumbnail" class="w-6 h-6 rounded-full mr-2")
    span(class="flex-grow text-body2 pr-2 line-clamp-1") {{ innerMenu.title }}
    div(class="shrink-0 w-5 h-5")
      f-svg-icon(v-if="hasNextLevel" iconName="keyboard_arrow_right" size="20" class="text-grey-600")
      f-svg-icon(v-else-if="isSelect" iconName="done" size="20" class="text-primary-400")
  div(ref="refContextMenu" role="contextual-menu" :class="{ 'hidden': !isExpand }" @click.stop)
    f-list(v-if="isExpand")
      template(v-for="(block, index) in innerMenu.blockList")
        f-list-item(v-if="block.blockTitle" class="text-grey-200" disabled) {{ block.blockTitle }}
        contextual-menu-node(
          v-for="childMenu in block.menuList"
          :menu="childMenu"
          @click:menu="$emit('click:menu', $event)"
          :selectMode="selectMode"
          :inputSelectValue="inputSelectValue"
        )
        div(v-if="index !== innerMenu.blockList.length - 1" class="mx-2 my-1 h-px bg-grey-200")
</template>

<script>
export default {
  name: 'ContextualMenuNode'
}
</script>

<script setup>
import { ref, computed } from 'vue'
import { createPopper } from '@popperjs/core'

const emit = defineEmits(['click:menu'])
const props = defineProps({
  menu: {
    type: Object,
    default: () => ({
      title: 'Menu', // required
      selectable: true,
      selectValue: 'Menu',
      disabled: false,
      icon: '',
      tooltip: '',
      thumbnail: '',
      clickHandler: () => { },
      blockList: [
        {
          blockTitle: 'Block Titles',
          menuList: [/** Menu **/]
        }
      ]
    })
  },
  inputSelectValue: {
    validator: () => true
  },
  selectMode: {
    type: Number,
    required: true
    /**
     * 0 - 不可選
     * 1 - 單選，可取消
     * 2 - 單選，不可取消
     * 3 - 多選
     */
  }
})

const innerMenu = computed(() => {
  const defaultOption = {
    disabled: false,
    selectable: true,
    selectValue: props.menu.title,
    icon: '',
    thumbnail: '',
    blockList: [],
    clickHandler: null,
    tooltip: ''
  }

  return Object.assign({}, defaultOption, props.menu)
})

const hasNextLevel = computed(() => innerMenu.value.blockList && innerMenu.value.blockList.length > 0)

const clickMenuHandler = () => {
  if (hasNextLevel.value) {
    return
  }

  emit('click:menu', innerMenu.value)
  innerMenu.value.clickHandler && innerMenu.value.clickHandler()
}
const isSelect = computed(() => {
  if (props.selectMode === 0) {
    return false
  } else if (props.selectMode === 3) {
    return props.inputSelectValue?.some(selectValue => selectValue === innerMenu.value.selectValue)
  } else {
    return props.inputSelectValue === innerMenu.value.selectValue
  }
})

const isExpand = ref(false)
const refTrigger = ref(null)
const refContextMenu = ref(null)

const expandMenu = async () => {
  if (isExpand.value) {
    return
  }

  isExpand.value = true

  createPopper(
    refTrigger.value,
    refContextMenu.value,
    {
      placement: 'right-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [-16, 16]
          }
        },
        {
          name: 'preventOverflow',
          options: {
            boundary: document.querySelector(`body`)
          }
        }
      ]
    }
  )
}

const collapseMenu = () => {
  isExpand.value = false
}

</script>

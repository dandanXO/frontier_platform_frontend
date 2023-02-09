<template lang="pug">
f-input-container(ref="refContainer")
  f-popper(
    placement="bottom-start"
    @expand="expand"
    @collapse="collapse"
    :offset="[0, -4]"
    :class="[{ 'pointer-events-none': disabled }]"
    data-cy="input-select"
  )
    template(#trigger="{ isExpand }")
      div(
        class="px-2 border rounded flex items-center hover:bg-grey-800 cursor-pointer"
        :class="[isExpand ? 'border-primary-500 outline-primary-200 bg-grey-700' : 'border-grey-700 bg-grey-900', 'h-7', 'w-17.5]']"
        :style="{ 'box-shadow': isExpand ? '0px 0px 0px 2px rgba(3, 57, 62, 0.85)' : '' }"
      )
        p(
          class="flex-grow text-caption"
          :class="[{ 'text-grey-600': disabled }, { 'text-grey-100': !disabled !== -1 }, { 'text-grey-250': !disabled === -1 }]"
        ) {{ value }}
        div(class="pl-1")
          f-svg-icon(
            iconName="keyboard_arrow_right"
            size="20"
            class="transform text-grey-500"
            :class="[isExpand ? '-rotate-90' : 'rotate-90']"
          )
    template(#content="{ collapsePopper }")
      f-contextual-menu(
        theme="dark"
        :menuTree="menuTree"
        @click:menu="(menu) => handleClick(menu, collapsePopper)"
      )
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  value: {
    required: true,
    validator: () => true,
  },
  blockList: {
    type: Array,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['expand', 'collapse', 'select'])

const menuTree = computed(() => ({
  width: 'w-37.5',
  blockList: props.blockList,
}))

const refContainer = ref(null)

const handleClick = (menu, collapsePopper) => {
  emit('select', menu.selectValue)
  collapsePopper()
}

const expand = () => {
  emit('expand')
}

const collapse = () => {
  emit('collapse')
}
</script>

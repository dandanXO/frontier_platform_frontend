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
        class="px-2 border rounded flex items-center hover:bg-grey-850 hover:border-grey-600 cursor-pointer"
        :class="[isExpand ? 'border-primary-300 bg-grey-700 shadow-[0_0_0_2px_#074E54]' : 'border-grey-700 bg-grey-900', 'h-7', 'w-17.5']"
      )
        p(
          class="flex-grow text-caption"
          :class="[disabled ? 'text-grey-600' : 'text-grey-400 hover:text-grey-250']"
        ) {{ value }}
        div(class="pl-1")
          f-svg-icon(
            iconName="keyboard_arrow_right"
            size="20"
            class="transform text-grey-250"
            :class="[isExpand ? '-rotate-90' : 'rotate-90']"
          )
    template(#content="{ collapsePopper }")
      f-contextual-menu(
        :theme="THEME.DARK"
        :menuTree="menuTree"
        @click:menu="(menu) => handleClick(menu, collapsePopper)"
      )
</template>

<script setup>
import { computed, ref } from 'vue'
import { THEME } from '@/utils/constants'

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

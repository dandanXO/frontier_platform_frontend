<template lang="pug">
list(class="min-w-57.5")
  list-item(v-if="menuTree.title" class="text-body2 !text-primary font-bold" disabled) {{ menuTree.title }}
  template(v-for="(block, index) in menuTree.blockList")
    list-item(v-if="block.blockTitle" class="text-black-500" disabled) {{ block.blockTitle }}
    contextual-menu-node(
      v-for="menu in block.menuList"
      :menu="menu"
      @click:menu="clickMenuHandler($event)"
      :selectMode="selectMode"
      :inputSelectValue="inputSelectValue"
    )
    div(v-if="index !== menuTree.blockList.length - 1" class="mx-2 my-1 h-px bg-black-400")
</template>

<script>
export default {
  name: 'ContextualMenu'
}
</script>

<script setup>
// update:inputSelectValue will execute before click:menu
const emit = defineEmits(['update:inputSelectValue', 'click:menu'])
const props = defineProps({
  inputSelectValue: {
    validator: () => true
  },
  selectMode: {
    type: Number,
    default: 0
    /**
     * 0 - 不可選
     * 1 - 單選，可取消
     * 2 - 單選，不可取消
     * 3 - 多選
     */
  },
  menuTree: {
    type: Object,
    default: () => ({
      title: 'Send Request',
      blockList: [
        {
          blockTitle: 'Block 1',
          menuList: [
            {
              title: 'Block 1 Menu 1',
              selectable: false,
              selectValue: null,
              disabled: false,
              icon: null,
              clickHandler: () => { },
              blockList: []
            }
          ]
        }
      ]
    })
  }
})

const clickMenuHandler = (menu) => {
  if (props.selectMode === 3) {
    const tempArr = [...props.inputSelectValue]
    const index = tempArr.findIndex(selectValue => selectValue === menu.selectValue)

    if (!~index) {
      tempArr.push(menu.selectValue)
    } else {
      tempArr.splice(index, 1)
    }
    emit('update:inputSelectValue', tempArr)
  } else if ([1, 2].includes(props.selectMode)) {
    if (props.selectMode === 1 && props.inputSelectValue === menu.selectValue) {
      emit('update:inputSelectValue', null)

    } else {
      emit('update:inputSelectValue', menu.selectValue)
    }
  }

  emit('click:menu', menu)
}
</script>

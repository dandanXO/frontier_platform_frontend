<template lang="pug">
div(class="dropdown relative cursor-pointer" v-click-away="clickAway")
  div(@click="isExpand ? collapse() : expand()")
    slot(name="displayItem"
      :isExpand="isExpand"
      :currentIndex="currentIndex"
      :option="options[currentIndex]"
    )
  slot(name="dropdownList"
    v-if="isExpand"
    :select="select"
    :options="options"
    :currentIndex="currentIndex"
  )
    list(class="absolute top-full -left-1 transform translate-y-2.5 min-w-24")
      list-item(
        v-for="(option, index) in options"
        :class="{'bg-primary-thin': index === currentIndex }"
        @click="select($event, option)"
      ) {{option[keyOptionDisplay]}}
</template>

<script>
import { computed, ref } from 'vue'
import { directive } from 'vue3-click-away'

export default {
  name: 'Dropdown',
  directives: {
    ClickAway: directive
  },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    keyOptionDisplay: {
      type: String,
      default: 'name'
    },
    keyOptionValue: {
      type: String,
      default: 'value'
    },
    value: {
      type: [String, Number, Boolean]
    },
    closeAfterOutsideClick: {
      type: Boolean,
      default: true
    },
    closeAfterSelect: {
      type: Boolean,
      default: true
    }
  },
  emits: ['expand', 'collapse', 'update:value', 'select'],
  setup (props, { emit }) {
    const isExpand = ref(false)

    const isBindingValue = computed(() => props.value !== undefined)
    const currentIndex = computed(() => {
      return isBindingValue.value
        ? props.options.findIndex(option => option[props.keyOptionValue] === props.value)
        : -1
    })

    const expand = () => {
      isExpand.value = true
      emit('expand')
    }

    const collapse = () => {
      isExpand.value = false
      emit('collapse')
    }

    const select = (e, option) => {
      e.stopPropagation()

      if (isBindingValue.value) {
        emit('update:value', option[props.keyOptionValue])
      }
      emit('select', option)
      props.closeAfterSelect && collapse()
    }

    const clickAway = () => {
      props.closeAfterOutsideClick && collapse()
    }

    return {
      isExpand,
      currentIndex,
      expand,
      collapse,
      select,
      clickAway
    }
  }
}
</script>

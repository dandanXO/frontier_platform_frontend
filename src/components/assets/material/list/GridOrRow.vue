<template lang="pug">
div(class='flex text-black-700 cursor-pointer')
  div(
    class='py-1 px-1.5 border-t-2 border-b-2 border-l-2 rounded-l'
    :class="[{ 'border-r-2': isGrid }, isGrid ? activeClass : '']"
    @click='handleClick(true)'
  )
    svg-icon(iconName='apps' size='24')
  div(
    class='py-1 px-1.5 border-t-2 border-b-2 border-r-2 rounded-r'
    :class="[{ 'border-l-2': !isGrid }, !isGrid ? activeClass : '']"
    @click='handleClick(false)'
  )
    svg-icon(iconName='format_list_bulleted' size='24')
</template>

<script>
export default {
  name: 'GridOrRow',
  props: {
    isGrid: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const activeClass = 'text-brand border-brand bg-brand-light'

    const handleClick = (value) => {
      emit('change', value)
    }

    return {
      activeClass,
      handleClick
    }
  }
}
</script>

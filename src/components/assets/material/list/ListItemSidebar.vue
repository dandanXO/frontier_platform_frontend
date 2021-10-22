<template lang="pug">
div(class='text-black-700 flex flex-col gap-3.5')
  tooltip(
    v-for='icon in iconList'
    placement="left"
    class="cursor-pointer"
    @click='handleClick(icon.name)'
  )
    div(class='w-7.5 h-7.5 hover:bg-brand hover:text-brand flex justify-center items-center rounded-full bg-opacity-10')
      svg-icon(:iconName='icon.name' size='24')
    template(#content)
      div(class="py-3 px-3 text-primary text-caption") {{icon.tooltip}}
  div(class='w-7.5 h-7.5')
    svg-icon(iconName='more_horiz' size='24')
</template>

<script>
import { ref } from '@vue/reactivity'

export default {
  name: 'ListItemSidebar',
  setup () {
    const iconList = ref([
      { name: 'create', tooltip: 'Edit' },
      { name: 'print', tooltip: 'Print card of fabric' },
      { name: 'u3m', tooltip: 'Download U3M' }
    ])

    const handleClick = (action) => {
      console.log('handleClick', action)
    }

    return {
      iconList,
      handleClick
    }
  }
}
</script>

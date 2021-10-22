<template lang="pug">
button(
  class='text-caption text-primary bg-black-200 py-1 px-2 rounded-xl hover:bg-brand-light hover:text-brand disabled:text-black-500'
  :disabled="disabled"
  @click='handleEdit'
) {{$t('UU0027')}}
</template>

<script>
export default {
  name: 'ListItemContentEdit',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    blockTitle: {
      type: String
    }
  },
  setup (props) {
    const handleEdit = () => {
      console.log('edit!', props.blockTitle)
    }

    return {
      handleEdit
    }
  }
}
</script>

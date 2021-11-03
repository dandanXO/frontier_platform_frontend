<template lang="pug">
dropdown
  template(#displayItem)
    svg-icon(
      iconName='swap_horiz'
      size='24'
      class='transform rotate-90 cursor-pointer text-black-700 hover:text-brand'
    )
  template(#dropdownList)
    div(class='z-100 text-body2 text-primary absolute bg-black-0 mt-2 w-57.5 right-0 rounded card-shadow py-2')
      div(class='font-bold px-3 py-2.5') {{$t('RR0064')}}
      div(
        v-for="option in optionList"
        class='flex justify-between items-center px-3 h-9 hover:bg-black-200'
        :class="[ option.value === value ? 'bg-black-200' : '']"
        @click="$emit('update:value', option.value)"
      )
        span {{option.name}}
        svg-icon(
          v-show='option.value === value'
          iconName='done'
          size='20'
          class='text-brand'
        )
</template>

<script>
export default {
  name: 'BtnSort',
  props: {
    value: {
      type: Number,
      default: 0
    },
    optionList: {
      type: Array,
      required: true
    }
  }
}
</script>

<template lang="pug">
div(:class="['flex flex-col', { 'gap-y-2': label !== '' }]")
  div(class="flex flex-row items-center gap-x-3")
    slot(name="slot:label")
      div(v-if="label !== ''" class="flex text-sm font-bold justify-center")
        p(class="text-grey-900") {{ label }}
        i(v-if="required" class="text-red-400 pl-0.5") *
        div(class="flex-start ml-2")
          slot(name="slot:suffix")
  div(class="w-full flex")
    slot(name="slot:prepend-item")
    div(class="w-full relative")
      slot
      div(
        v-if="slots['slot:hint-error'] || !!hintError || slots['slot:hint-supporting'] || !!hintSupporting"
        class="pt-2"
      )
        slot(name="slot:hint-error")
          template(v-if="!!hintError && typeof hintError === 'string'")
            i18n-t(
              v-if="te(hintError)"
              :keypath="hintError"
              scope="global"
              tag="p"
              class="text-caption text-red-400 leading-1.3 whitespace-nowrap h-4"
            )
              template(#newline)
                br
            p(
              v-else
              class="text-caption text-red-400 leading-1.3 whitespace-nowrap h-4"
              data-cy="hintError"
            ) {{ hintError }}
        slot(name="slot:hint-supporting")
          template(v-if="!!hintSupporting")
            i18n-t(
              v-if="te(hintSupporting)"
              :keypath="hintSupporting"
              scope="global"
              tag="p"
              class="text-caption text-grey-600 leading-1.3 whitespace-nowrap"
            )
              template(#newline)
                br
            p(v-else class="text-caption text-grey-600 leading-1.3 whitespace-nowrap") {{ hintSupporting }}
      slot(name="slot:hint")
    slot(name="slot:append-item")
</template>

<script>
export default {
  name: 'FInputContainer',
}
</script>

<script setup>
import { useSlots } from 'vue'
import { useI18n } from 'vue-i18n'
const slots = useSlots()
const { te } = useI18n()
defineProps({
  label: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  hintSupporting: {
    type: String,
    default: '',
  },
  hintError: {
    type: [String, Boolean],
    default: '',
  },
})
</script>

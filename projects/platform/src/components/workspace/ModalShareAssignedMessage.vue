<template lang="pug">
modal-behavior(
  :header="$t('RR0146')"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="message && message.length > 1000"
  @click:primary="save"
  @click:secondary="closeModal"
)
  template(#note)
    div(class="flex items-center gap-x-1.5")
      f-svg-icon(iconName="info_outline" class="text-grey-600" size="14")
      p(class="text-grey-600 text-caption") {{ $t('WW0149', { number: 1000 }) }}
  div(class="w-88")
    f-input-textarea(
      v-model:textValue="message"
      :label="$t('RR0202')"
      minHeight="min-h-25"
    )
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'

const props = defineProps<{
  message: string | null
  onUpdateMessage: (message: string) => void
}>()

const store = useStore()

const message = ref(props.message)
const save = () => {
  props.onUpdateMessage(message.value ?? '')
  closeModal()
}
const closeModal = () => store.dispatch('helper/closeModalBehavior')
</script>

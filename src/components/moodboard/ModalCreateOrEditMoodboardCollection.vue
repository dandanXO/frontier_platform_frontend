<template lang="pug">
modal-behavior(
  :header="mode === CREATE_EDIT.EDIT ? $t('FF0009') : $t('QQ0056')"
  :primaryBtnText="mode === CREATE_EDIT.CREATE ? $t('UU0020') : $t('UU0018')"
  :primaryBtnDisabled="primaryBtnDisabled"
  @click:primary="primaryHandler"
)
  template(#note v-if="mode === CREATE_EDIT.CREATE")
    div(class="flex items-center text-black-600")
      svg-icon(iconName="info_outline" size="20")
      p(class="text-caption leading-1.6 pl-1.5") {{ $t('QQ0060') }}
  div(class="w-85")
    input-text(
      v-model:textValue="formData.name"
      required
      :label="$t('FF0010')"
      :placeholder="$t('QQ0058')"
      class="pb-6"
    )
    input-textarea(
      v-model:textValue="formData.description"
      :label="$t('FF0012')"
      :placeholder="$t('QQ0059')"
      height="120"
    )
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { CREATE_EDIT } from '@/utils/constants.js'

const props = defineProps({
  mode: {
    type: Number,
    default: CREATE_EDIT.CREATE
  },
  nodeId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})

const { t } = useI18n()
const store = useStore()

const formData = reactive({
  nodeId: props.nodeId,
  name: '',
  description: ''
})

if (props.mode === CREATE_EDIT.EDIT) {
  Object.assign(formData, {
    name: props.name,
    description: props.description,
  })
}

const primaryBtnDisabled = computed(() => !formData.name)

const primaryHandler = async () => {
  store.dispatch('helper/pushModalLoading')
  if (props.mode === CREATE_EDIT.EDIT) {
    await store.dispatch('moodboard/updateMoodboardNodeCollection', formData)
    store.dispatch('helper/pushFlashMessage', t('QQ0064'))
    store.dispatch('helper/reloadInnerApp')
  } else {
    await store.dispatch('moodboard/createMoodboardNodeCollection', formData)
    store.dispatch('helper/pushFlashMessage', t('QQ0063'))
  }
  store.dispatch('helper/clearModalPipeline')
}
</script>

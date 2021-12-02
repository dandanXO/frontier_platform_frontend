<template lang="pug">
div(class="w-fit px-8 flex flex-col items-center")
  i18n-t(keypath="EE0063" tag="h6" class="text-h6 font-bold text-primary text-center mb-4")
    template(#number) {{failMaterialList.length}}
  div(class="w-84")
    p(class="text-body2 text-primary text-center line-height-1.6 pb-4") {{$t('EE0064')}}
    overlay-scrollbar-container(class="max-h-86.5 -mx-8")
      div(class="px-8 grid cols-1 divide-y divide-black-400")
        div(v-for="(materialId, index) in failMaterialList" class="py-2.5 px-5 text-body2 line-height-1.6 grid grid-cols-11 items-center")
          p(class="font-bold col-start-2 col-span-1") {{index + 1}}
          p(class="col-start-5") {{materialId}}
  btn-group(
    class="h-25"
    :primaryText="$t('UU0031')"
    @click:primary="close"
    :secondaryButton="false"
  )
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'ModalAddToWorkspaceFail',
  props: {
    failMaterialList: {
      type: Array,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const close = () => { store.dispatch('helper/closeModal') }

    return {
      close
    }
  }
}
</script>

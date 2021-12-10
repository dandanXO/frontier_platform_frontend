<template lang="pug">
div(class="w-120 border-t border-black-400")
  div(class="w-full flex justify-center items-center border-b border-black-400 overflow-hidden")
    div(class="w-full h-full flex justify-center items-center py-15 relative bg-black-0")
      image-crop-area(ref="imageCropper" :cropRectSize="cropRectSize" :image="image" :rotationAngle="rotationAngle")
      div(v-if="isCropping" class="w-full absolute bottom-0 flex justify-center")
        svg-icon(iconName="loading" size="50" class="justify-self-end cursor-pointer text-brand-dark")
  div(class="py-3.5 w-66 mx-auto")
    input-range(
      v-model:range="rotationAngle"
      :min="-180"
      :max="180"
      :height="2"
      :width="166"
      :startAtCenter="true"
      :disabled="isCropping"
    )
      template(#min-end="{min}")
        div(class="text-primary text-body2") {{min}}°
      template(#max-end="{max}")
        div(class="text-primary text-body2") {{max}}°
  div(class="h-25 flex justify-center items-center")
    div(class="flex justify-center gap-3")
      btn(size="md" type="secondary" :disabled="isCropping" @click="closeModal") {{ isAllowGoBack ? $t('UU0004') : $t('UU0002') }}
      btn(size="md" :disabled="isCropping" @click="confirm") {{$t('UU0018')}}
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import ImageCropArea from '@/components/imageCropper/ImageCropArea'

export default {
  name: 'ModalCropImage',
  components: { ImageCropArea },
  props: {
    image: {
      type: Object
    },
    cropRectSize: {
      type: Number
    },
    afterCropHandler: {
      type: Function,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const imageCropper = ref(null)
    const isCropping = ref(false)
    const rotationAngle = ref(0)

    const confirm = async () => {
      isCropping.value = true
      const croppedImage = await imageCropper.value?.cropImage()
      await props.afterCropHandler(croppedImage, props.image?.file)
      closeModal()
    }

    const isAllowGoBack = computed(() => store.getters['helper/modalPipeline'].length > 1)

    const closeModal = () => {
      isCropping.value = false
      store.dispatch('helper/closeModal')
    }

    return {
      isCropping,
      isAllowGoBack,
      closeModal,
      confirm,
      imageCropper,
      rotationAngle
    }
  }
}
</script>

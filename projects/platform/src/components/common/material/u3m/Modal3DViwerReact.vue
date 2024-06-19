<template lang="pug">
modal-behavior(:closable="false" needFullScreen header="")
  #app(class="w-screen h-full")
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, defineEmits } from 'vue'
import { useStore } from 'vuex'
import type {
  MaterialCustomU3m,
  MaterialU3m,
  Material,
} from '@frontier/platform-web-sdk'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const props = defineProps<{
  materialId: number
  material: Material
  u3m: Required<MaterialCustomU3m | MaterialU3m>
  showCustomModels?: boolean
  show3dView?: boolean
}>()

const emit = defineEmits(['update:show3dView'])

onMounted(async () => {
  const importV = await import('frontier-3d-viewer')
  const viewer = importV.default
  // event fired when react component ready
  viewer.addEventListeners('onMounted', () => {})
  // set props
  viewer.setProps({
    texture: {
      base: props.u3m.baseImgUrl,
      alpha: props.u3m.alphaImgUrl,
      bump: props.u3m.bumpImgUrl,
      bumpScale: 0.05,
      dispImgUrl: props.u3m.dispImgUrl,
      roughImgUrl: props.u3m.roughImgUrl,
      normalImgUrl: props.u3m.normalImgUrl,
      defaultMapScale: 15,
      dpi: props.u3m.dpi * 2.4,
      mapScale:
        props.material?.faceSide?.u3mImage?.cropRecord?.squareCropRecord
          ?.scaleRatio,
    },
    translate: {
      colorEditor: t('EE0139'),
      alpha: t('EE0133'),
      roughness: t('EE0134'),
      specular: t('EE0135'),
      scaleSize: t('EE0136'),
      rotationX: t('EE0192'),
      rotationY: t('EE0193'),
      '3dViewer': t('UU0006'),
      environmentMapping: t('EE0194'),
      '3dViewerEditor': t('EE0137'),
      mappingVisibility: t('EE0195'),
      enterPantone: t('EE0140'),
      screenshot: t('UU0125'),
      exit: t('UU0112'),
      removeColor: t('UU0121'),
      addColor: t('UU0120'),
    },
  })

  // need to render react app in to dom.
  viewer.render()

  // event fired when materials and models loaded
  viewer.addEventListeners('onAssetsLoaded', () => {})

  // event fired when user clicked close button and all listener removed
  viewer.addEventListeners('unmounted', () => {
    emit('update:show3dView', false)
    store.dispatch('helper/closeModalBehavior')
  })
})

onBeforeUnmount(() => {})
</script>

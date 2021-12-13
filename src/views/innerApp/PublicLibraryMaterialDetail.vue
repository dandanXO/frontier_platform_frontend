<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    div(class="pt-12 pb-9 flex justify-between")
      breadcrumb(:breadcrumbList="breadcrumbList" @click:item="$router.push($event.path)")
    div
      //- Upper part
      div
        //- Title
        div(class="pb-7.5")
          div(class="flex items-center pb-2")
            h5(class="text-h5 text-primary font-bold line-clamp-1 pr-3") {{`${material.materialNo} ${material.description}`}}
            svg-icon(iconName="clone" class="text-black-700 cursor-pointer" size="24")
          i18n-t(keypath="II0002" tag="p" class="text-caption text-black-700")
            template(#displayName) {{publish.displayName}}
        div(class="flex gap-x-10")
          //- Cover Img
          div(class="w-125")
            div(class="w-full h-125")
              template(v-if="!!imageList[currentDisplayIndex].src")
                img(class="w-full h-full" :src="imageList[currentDisplayIndex].src")
              div(v-else class="rounded w-full h-full border border-black-400 bg-black-200 flex items-center justify-center text-h4 font-bold text-black-400") {{$t('RR0103')}}
            div(class="flex pt-3 pb-4")
              p(v-for="text in imageList[currentDisplayIndex].text" class="text-caption text-center font-bold") {{text}}
            div(class="grid grid-flow-col gap-x-2 justify-start")
              div(v-for="(image, index) in imageList" @click="currentDisplayIndex = index")
                div(class="w-19.5 h-19.5 rounded overflow-hidden border-black-400 bg-black-200" :class="[currentDisplayIndex === index ? 'border-4' : 'border']")
                  template(v-if="!!image.src")
                    img(class="w-full h-full" :src="image.src")
          div(class="flex flex-col gap-y-7.5")
            //- Fabric Spec
            div
              h5(class="text-h5 font-bold text-primary pb-3") {{$t('II.Fabric Specification')}}
              div(class="grid gap-y-2")
                p(v-for='item in materialBasicInfo' class='text-body2 text-primary line-clamp-1') {{item.name}}: {{item.value}}
            //- Inventory
            div
              h5(class="text-h5 font-bold text-primary pb-3") {{$t('II.Inventory')}}
              p(class='text-body2 text-primary line-clamp-1') {{materialInfo.totalInventoryQty.name}}: {{materialInfo.totalInventoryQty.value}}
            //- Pricing
            div
              h5(class="text-h5 font-bold text-primary pb-3") {{$t('II.Pricing')}}
              div(class="grid gap-y-2")
                p(v-for='item in materialPublicPriceInfo' class='text-body2 text-primary line-clamp-1') {{item.name}}: {{item.value}}
            //- Colors
            div
              h5(class="text-h5 font-bold text-primary pb-3") {{$t('II.Colors')}}
              div(class="flex items-center gap-x-2")
                div(v-for="pantone in material.pantoneList")
                  tooltip(placement="right")
                    template(#trigger)
                      div(class="rounded w-5.5 h-5.5" :style="{ 'background-color': `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }")
                    template(#content)
                      div(class="w-30 h-11 relative")
                        div(class="w-30 h-30 absolute -top-29 rounded-t" :style="{ 'background-color': `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }")
                        div(class="p-2 text-primary text-caption font-bold")
                          div(class="pb-1") {{pantone.name}}
                          div {{pantone.majorColorName}}
            //- U3M
            div
              h5(class="text-h5 font-bold text-primary pb-3") {{$t('II.3D Material')}}
              btn(size="md" @click="openModalViewer") {{$t('UU0006')}}
      //- Lower part
      div(class="pt-5 grid gap-y-10")
        div
          h5(class="text-h5 font-bold text-primary pb-7.5") {{$t('II.Tags')}}
          div(class="flex flex-wrap gap-x-2 gap-y-3")
            div(v-for="tag in [...material.publicTagList, ...material.aiTagList]" class="px-3 h-8 flex items-center bg-primary-thin rounded text-body2 text-primary") {{tag}}
        div
          h5(class="text-h5 font-bold text-primary pb-7.5") {{$t('II.More Information')}}
          div(class="flex flex-wrap gap-5")
            attachment-item(v-for="attachment in material.attachmentList" :attachment="attachment" :isReadOnly="true")
</template>

<script>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import useMaterial from '@/composables/useMaterial'
import { U3M_STATUS } from '@/utils/constants'
import AttachmentItem from '@/components/assets/material/edit/AttachmentItem'

export default {
  name: 'PublicLibraryMaterialDetail',
  components: {
    AttachmentItem
  },
  async setup () {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()
    const { parsePath } = useNavigation()
    const [workspaceNodeLocation, workspaceNodeId] = route.params.nodeKey.split('-')

    const { publish } = await store.dispatch('publicLibrary/getPublicMaterial', { workspaceNodeId, workspaceNodeLocation })

    const material = computed(() => store.getters['material/material'])
    const breadcrumbList = computed(() => {
      return [
        {
          name: t('DD0044'),
          path: parsePath('/:orgNo/public-library')
        },
        {
          name: material.value.materialNo,
          path: parsePath('/:orgNo/public-library/:materialId')
        }
      ]
    })
    const { materialInfo, materialBasicInfo, materialInventoryInfo, materialPublicPriceInfo, materialPrivatePriceInfo, imageList, defaultCoverImgIndex } = useMaterial(material.value)
    const currentDisplayIndex = ref(defaultCoverImgIndex.value)

    const openModalViewer = () => {
      const { u3m: { status, baseImgUrl, normalImgUrl } } = material.value

      if (status !== U3M_STATUS.COMPLETED) {
        store.dispatch('helper/openModalConfirm', {
          title: t('EE0029'),
          content: t('EE0039'),
          primaryText: t('UU0031')
        })
      } else {
        store.dispatch('helper/pushModal', {
          component: 'modal-viewer',
          header: t('UU0006'),
          properties: {
            baseImgUrl: baseImgUrl,
            normalImgUrl: normalImgUrl
          }
        })
      }
    }

    return {
      breadcrumbList,
      material,
      publish,
      materialInfo,
      materialBasicInfo,
      materialInventoryInfo,
      materialPublicPriceInfo,
      materialPrivatePriceInfo,
      imageList,
      defaultCoverImgIndex,
      currentDisplayIndex,
      U3M_STATUS,
      openModalViewer
    }
  }
}

</script>

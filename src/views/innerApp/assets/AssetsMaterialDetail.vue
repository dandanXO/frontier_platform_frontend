<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    div(class="pt-12 pb-9 flex justify-between")
      breadcrumbs(:breadcrumbsList="breadcrumbsList" @click:item="$router.push($event.path)")
    div
      div
        //- Title
        div(class="pb-7.5")
          div(class="flex items-center pb-2")
            h5(class="text-h5 text-primary font-bold line-clamp-1 pr-3") {{`${material.materialNo} ${material.description}`}}
            svg-icon(iconName="create" class="text-black-700 cursor-pointer" size="24" @click="goToAssetMaterialEdit(material)")
          p(class="text-caption text-black-700") {{$t('EE0014')}} : {{new Date(material.updateDate).toLocaleString().replace(', ', ' at ')}}
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
              h5(class="text-h5 font-bold text-primary pb-3") {{$t('EE0002')}}
              div(class="grid gap-y-2")
                p(v-for='item in materialBasicInfo' class='text-body2 text-primary line-clamp-1') {{item.name}}: {{item.value}}
            //- Colors
            div
              h5(class="text-h5 font-bold text-primary pb-3") {{$t('EE0015')}}
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
              h5(class="text-h5 font-bold text-primary pb-3") {{$t('EE0016')}}
              template(v-if="material.u3m.status === U3M_STATUS.UNQUALIFIED")
                p(class="flex items-center text-body2 text-primary line-height-1.6 pb-2") {{$t('EE0017')}} : {{$t('EE0020')}}
                  tooltip(placement="top" class="pl-1" :manual='true')
                    template(#trigger)
                      svg-icon(iconName="info_outline" class='cursor-pointer' size="14")
                    template(#content)
                      div(class="p-5 w-68.5")
                        span(class="line-height-1.6") {{$t('EE0021')}}
                        span(class="text-body2 text-assist-blue underline line-height-1.6") {{$t('UU0029')}}
              template(v-else-if="material.u3m.status === U3M_STATUS.INITIAL")
                p(class="text-body2 text-primary line-height-1.6 pb-2") {{$t('EE0017')}}: {{$t('EE0019')}}
              template(v-if="material.u3m.status === U3M_STATUS.PROCESSING")
                p(class="text-body2 text-primary line-height-1.6 pb-2") {{$t('EE0017')}}: {{$t('EE0022')}}
              template(v-else-if="material.u3m.status === U3M_STATUS.COMPLETED")
                p(class="text-body2 text-primary line-height-1.6 pb-2") {{$t('EE0017')}}: {{$t('EE0018')}} &nbsp
                  span(class="text-assist-blue underline cursor-pointer") {{$t('UU0005')}}
              template(v-else-if="material.u3m.status === U3M_STATUS.FAIL")
                p(class="flex items-center text-body2 text-primary line-height-1.6 pb-2") {{$t('EE0017')}}: {{$t('EE0024')}}
                  tooltip(placement="top" class="pl-1")
                    template(#trigger)
                      svg-icon(iconName="info_outline" size="14")
                    template(#content)
                      div(class="p-5 w-71")
                        i18n-t(keypath="EE0023" tag="p")
                          template(#email)
                            span(class="text-assist-blue") support@frontier.cool
              btn(size="md" @click="openModalViewer") {{$t('UU0006')}}
      div(class="pt-20 flex flex-col gap-y-10")
        div(class="w-full grid grid-flow-col gap-x-5 justify-start border-b border-black-400")
          div(v-for="tab in tabList" class="cursor-pointer" @click="currentTab = tab.id")
            p(class="pb-2 text-body1" :class="[tab.id === currentTab ? 'border-b-4 border-brand text-primary font-bold' : 'text-black-600' ]" ) {{tab.name}}
        div
          template(v-if="currentTab === TAB.TAGS")
            div
              p(class="pb-3 text-body2 font-bold text-primary") {{$t('RR0027')}}
              div(class="flex flex-wrap gap-x-2 gap-y-3")
                div(v-for="tag in material.publicTagList" class="px-3 h-8 flex items-center bg-primary-thin rounded text-body2 text-primary") {{tag}}
            div(class="pt-7")
              p(class="pb-3 text-body2 font-bold text-primary") {{$t('RR0071')}}
              div(class="flex flex-wrap gap-x-2 gap-y-3")
                div(v-for="tag in material.aiTagList" class="px-3 h-8 flex items-center bg-primary-thin rounded text-body2 text-primary") {{tag}}
            div(class="mt-10 rounded-md bg-black-100 px-5 py-7.5")
              h6(class="text-h6 font-bold text-black-600") {{$t('EE0026')}}
              div(class="pt-7.5")
                p(class="pb-3 text-body2 font-bold text-primary") {{$t('RR0028')}}
                div(class="flex flex-wrap gap-x-2 gap-y-3")
                  div(v-for="tag in material.privateTagList" class="px-3 h-8 flex items-center bg-primary-thin rounded text-body2 text-primary") {{tag}}
          template(v-else-if="currentTab === TAB.PRICING")
            div(class="grid gap-y-5")
              div(v-for="item in materialPublicPriceInfo" class="text-body2 text-primary grid grid-cols-8")
                p(class="col-span-3") {{item.name}}
                p(class="col-span-5") {{item.value}}
            div(class="mt-10 rounded-md bg-black-100 p-7.5")
              h6(class="text-h6 font-bold text-black-600") {{$t('EE0026')}}
              div(class="pt-7.5")
                div(class="grid gap-y-5")
                  div(v-for="item in materialPrivatePriceInfo" class="text-body2 text-primary grid grid-cols-8")
                    p(class="col-span-3") {{item.name}}
                    p(class="col-span-5") {{item.value}}
          template(v-else-if="currentTab === TAB.INVENTORY")
            div(class="rounded-md bg-black-100 p-7.5 flex flex-col gap-y-17.5")
              div
                h6(class="text-h6 font-bold text-black-600") {{$t('EE0026')}}
                div(class="pt-7.5")
                  div(class="grid gap-y-5")
                    div(v-for="item in materialInventoryInfo" class="text-body2 text-primary grid grid-cols-8")
                      p(class="col-span-3") {{item.name}}
                      p(class="col-span-5") {{item.value}}
              div
                h6(class="text-h6 font-bold text-black-600") {{$t('EE0027')}}
                div(class="pt-7.5 flex flex-col gap-y-7.5")
                  div(class="flex items-center gap-x-11 text-body2 text-primary")
                    p {{materialInfo.totalInventoryQty.name}}
                    p {{materialInfo.totalInventoryQty.value}}
                    input-checkbox(
                      v-model:inputValue="material.isPublicInventory"
                      :label="$t('EE0028')"
                      binary
                      size="20"
                      disabled
                    )
                  div(class="w-117.5 text-body2 text-primary")
                    div(class="bg-primary-thin w-full h-7.5 grid grid-cols-4 justify-items-center content-center")
                      p {{$t('RR0035')}}
                      p {{$t('RR0036')}}
                      p {{$t('RR0037')}}
                      p {{$t('RR0038')}}
                    div(class="divide-y divide-solid divide-primary-thin")
                      div(v-for="inventory in material.inventoryList" class="h-10.5 grid grid-cols-4 justify-items-center content-center")
                        p {{inventory.section}}
                        p {{inventory.shelf}}
                        p {{inventory.quantity}}
                        p {{inventory.unit}}
          template(v-else-if="currentTab === TAB.SUP")
            div(class="flex flex-wrap gap-5")
              attachment-item(v-for="attachment in attachmentList" :attachment="attachment" :isReadOnly="true")
</template>

<script>
import useNavigation from '@/composables/useNavigation'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { U3M_STATUS } from '@/utils/constants'
import useMaterial from '@/composables/useMaterial'
import { useRoute } from 'vue-router'
import AttachmentItem from '@/components/assets/material/edit/AttachmentItem'

export default {
  name: 'AssetsMaterialDetail',
  components: { AttachmentItem },
  async setup () {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()
    const { parsePath, goToAssetMaterialEdit } = useNavigation()

    await store.dispatch('material/getMaterial', { materialId: route.params.materialId })

    const TAB = {
      TAGS: 0,
      PRICING: 1,
      INVENTORY: 2,
      SUP: 3
    }
    const tabList = [
      {
        name: t('EE0005'),
        id: TAB.TAGS
      },
      {
        name: t('EE0004'),
        id: TAB.PRICING
      },
      {
        name: t('EE0003'),
        id: TAB.INVENTORY
      },
      {
        name: t('EE0025'),
        id: TAB.SUP
      }
    ]
    const currentTab = ref(tabList[0].id)
    const material = computed(() => store.getters['material/material'])
    const attachmentList = computed(() => store.getters['material/attachmentList'])
    const { materialInfo, materialBasicInfo, materialInventoryInfo, materialPublicPriceInfo, materialPrivatePriceInfo, imageList, defaultCoverImgIndex } = useMaterial(material.value)
    const currentDisplayIndex = ref(defaultCoverImgIndex.value)
    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const breadcrumbsList = computed(() => {
      const prefix = routeLocation.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId'
      return [
        {
          name: t('DD0044'),
          path: parsePath(`${prefix}/assets`)
        },
        {
          name: material.value.materialNo,
          path: parsePath(`${prefix}/assets/:materialId`)
        }
      ]
    })

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
      material,
      attachmentList,
      breadcrumbsList,
      goToAssetMaterialEdit,
      currentDisplayIndex,
      imageList,
      tabList,
      TAB,
      currentTab,
      materialInfo,
      materialBasicInfo,
      materialInventoryInfo,
      materialPublicPriceInfo,
      materialPrivatePriceInfo,
      U3M_STATUS,
      openModalViewer
    }
  }
}
</script>

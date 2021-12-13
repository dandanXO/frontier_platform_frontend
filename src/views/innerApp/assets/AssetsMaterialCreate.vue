<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    div(class="pt-12 pb-9 flex justify-between")
      breadcrumb(:breadcrumbList="breadcrumbList" @click:item="$router.push($event.path)")
      btn(size="sm" type="secondary" class="ml-5") {{$t('UU0009')}}
    div
      div(class="pb-15 mb-5 border-b border-black-400")
        div(class="h-16 flex items-center")
          h5(class="text-h5 text-primary font-bold pr-1.5") {{$t('DD0063')}}
        div(class="pl-15")
          input-container(:label="$t('DD0062')" class="relative z-12")
            div(class="flex items-center gap-x-3")
              input-select(
                v-model:selectValue="material.isDoubleSideMaterial"
                :options="optionSingleOrDouble"
                keyOptionDisplay="name"
                keyOptionValue="value"
                class="w-50"
              )
              input-select(
                v-if="!material.isDoubleSideMaterial"
                v-model:selectValue="material.sideType"
                :options="optionSideType"
                keyOptionDisplay="name"
                keyOptionValue="value"
                class="w-25"
              )
      block-material-information(:validations="validations")
      block-material-inventory(:validations="validations")
      block-material-pricing(:validations="validations")
      block-material-attachment(:tempMaterialId="tempMaterialId")
      div(class="flex justify-center items-center pt-17.5")
        div(class="grid grid-cols-2 gap-x-2")
          btn(size="md" type="secondary" class="h-10" @click="cancel") {{$t('UU0002')}}
          btn(size="md" class="h-10" @click="createMaterial") {{$t('UU0020')}}
</template>

<script>
import BlockMaterialInformation from '@/components/assets/material/edit/BlockMaterialInformation.vue'
import BlockMaterialInventory from '@/components/assets/material/edit/BlockMaterialInventory.vue'
import BlockMaterialPricing from '@/components/assets/material/edit/BlockMaterialPricing.vue'
import BlockMaterialAttachment from '@/components/assets/material/edit/BlockMaterialAttachment'
import useMaterialValidation from '@/composables/useMaterialValidation'
import useNavigation from '@/composables/useNavigation'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { v4 as uuidv4 } from 'uuid'
import { SIDE_TYPE } from '@/utils/constants'
import { computed } from 'vue'

export default {
  name: 'AssetsMaterialCreate',
  components: {
    BlockMaterialInformation,
    BlockMaterialInventory,
    BlockMaterialPricing,
    BlockMaterialAttachment
  },
  async setup () {
    const { t } = useI18n()
    const store = useStore()
    const { validations, validate } = useMaterialValidation()
    const { parsePath, goToMaterialUpload, goToAssets } = useNavigation()
    const tempMaterialId = uuidv4()
    const optionSideType = [
      {
        name: t('DD0048'),
        value: SIDE_TYPE.FACE
      },
      {
        name: t('DD0049'),
        value: SIDE_TYPE.BACK
      }
    ]

    const optionSingleOrDouble = [
      {
        name: t('DD0014'),
        value: true
      },
      {
        name: t('DD0061'),
        value: false
      }
    ]

    const material = computed(() => store.getters['material/material'])
    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const breadcrumbList = computed(() => {
      const prefix = routeLocation.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId'
      return [
        {
          name: t('DD0044'),
          path: parsePath(`${prefix}/assets`)
        },
        {
          name: t('DD0045'),
          path: parsePath(`${prefix}/assets/upload`)
        },
        {
          name: t('DD0012'),
          path: parsePath(`${prefix}/assets/upload/manual`)
        }
      ]
    })

    const createMaterial = async () => {
      if (validate()) {
        return
      }

      store.dispatch('helper/pushModalLoading')
      await store.dispatch('material/createMaterial', { tempMaterialId })
      store.dispatch('helper/closeModalLoading')
      goToAssets()
      store.dispatch('helper/pushModal', {
        header: t('DD0029'),
        component: 'modal-how-to-scan'
      })
    }

    const cancel = async () => {
      store.dispatch('helper/pushModalConfirm', {
        title: t('DD0033'),
        content: t('DD0034'),
        secondaryText: t('UU0001'),
        secondaryHandler: goToMaterialUpload,
        primaryText: t('UU0002')
      })
    }

    store.dispatch('material/resetMaterial')
    await store.dispatch('material/getMaterialOptions')

    return {
      validations,
      createMaterial,
      cancel,
      optionSideType,
      optionSingleOrDouble,
      material,
      breadcrumbList,
      tempMaterialId
    }
  }
}
</script>

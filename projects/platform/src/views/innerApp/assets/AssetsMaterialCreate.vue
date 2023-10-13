<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-260 h-fit pb-25")
    div(class="pt-12 pb-9 flex justify-between")
      global-breadcrumb-list(
        :breadcrumbList="breadcrumbList"
        @click:item="$router.push($event.path)"
      )
      f-button(size="sm" type="secondary" class="ml-5" @click="openModalMassUpload") {{ $t('UU0009') }}
    div(class="grid grid-cols-1 divide-y divide-grey-250")
      div(class="pb-15")
        div(class="h-16 flex items-center")
          h5(class="text-h5 text-grey-900 font-bold pr-1.5") {{ $t('DD0063') }}
        div(class="pl-15")
          f-input-container(:label="$t('DD0062')")
            div(class="flex items-center gap-x-3")
              f-select-dropdown(
                v-model:selectValue="material.isDoubleSideMaterial"
                :dropdownMenuTree="singleOrDoubleMenuTree"
                class="w-50"
              )
              f-select-dropdown(
                v-if="!material.isDoubleSideMaterial"
                v-model:selectValue="material.sideType"
                :dropdownMenuTree="sideTypeMenuTree"
                class="w-25"
              )
      block-material-information(:invalidation="invalidation")
      block-material-inventory(:invalidation="invalidation")
      block-material-pricing(:invalidation="invalidation")
      block-material-additional-info(:tempMaterialId="tempMaterialId")
      f-expansion-panel
        template(#trigger="{ isExpand }")
          div(class="h-15 flex items-center justify-between")
            h5(class="text-h5 text-grey-900 font-bold") {{ $t('RR0299') }}
            f-svg-icon(
              iconName="keyboard_arrow_right"
              size="20"
              class="transform text-grey-900"
              :class="[isExpand ? '-rotate-90' : 'rotate-90']"
            )
        template(#content)
          div(class="px-15 pt-5")
            p(class="text-body2 font-bold text-grey-900") {{ $t('RR0299') }}
            p(class="py-5 text-body2 text-grey-900") {{ $t('EE0166') }}
            block-material-upload-u3m(
              ref="refBlockMaterialUploadU3m"
              :mode="CREATE_EDIT.CREATE"
              class="w-95"
            )
    div(class="flex justify-center items-center pt-17.5")
      div(class="grid grid-cols-2 gap-x-2")
        f-button(size="md" type="secondary" class="h-10" @click="cancel") {{ $t('UU0002') }}
        f-button(
          size="md"
          class="h-10"
          :disabled="isInvalid"
          @click="createMaterial"
          data-cy="create-material"
        ) {{ $t('UU0020') }}
</template>

<script setup>
import BlockMaterialInformation from '@/components/assets/edit/BlockMaterialInformation.vue'
import BlockMaterialInventory from '@/components/assets/edit/BlockMaterialInventory.vue'
import BlockMaterialPricing from '@/components/assets/edit/BlockMaterialPricing.vue'
import BlockMaterialAdditionalInfo from '@/components/assets/edit/BlockMaterialAdditionalInfo.vue'
import BlockMaterialUploadU3m from '@/components/assets/edit/BlockMaterialUploadU3m.vue'
import useMaterialValidation from '@/composables/useMaterialValidation'
import useNavigation from '@/composables/useNavigation'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { v4 as uuidv4 } from 'uuid'
import { SIDE_TYPE, NOTIFY_TYPE, CREATE_EDIT } from '@/utils/constants'
import { computed, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import scrollTo from '@/utils/scrollTo'

const { t } = useI18n()
const store = useStore()
const material = computed(() => store.getters['assets/material'])
const { invalidation, validate, isInvalid } = useMaterialValidation(material)
const { parsePath, goToMaterialUpload, goToAssets } = useNavigation()
const tempMaterialId = uuidv4()

const sideTypeMenuTree = computed(() => ({
  width: 'w-25',
  blockList: [
    {
      menuList: [
        {
          title: t('DD0048'),
          selectValue: SIDE_TYPE.FACE,
        },
        {
          title: t('DD0049'),
          selectValue: SIDE_TYPE.BACK,
        },
      ],
    },
  ],
}))

const singleOrDoubleMenuTree = computed(() => ({
  width: 'w-50',
  blockList: [
    {
      menuList: [
        {
          title: t('DD0014'),
          selectValue: true,
        },
        {
          title: t('DD0061'),
          selectValue: false,
        },
      ],
    },
  ],
}))

const isConfirmedToLeave = ref(false)
const routeLocation = computed(() => store.getters['helper/routeLocation'])
const breadcrumbList = computed(() => {
  const prefix = routeLocation.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId'
  return [
    {
      name: t('RR0008'),
      path: parsePath(`${prefix}/assets`),
    },
    {
      name: t('DD0045'),
      path: parsePath(`${prefix}/assets/upload`),
    },
    {
      name: t('DD0012'),
      path: parsePath(`${prefix}/assets/upload/manual`),
    },
  ]
})

const openModalMassUpload = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-mass-upload',
  })
}

const refBlockMaterialUploadU3m = ref(null)

const createMaterial = async () => {
  if (!validate()) {
    scrollTo('block-material-information')
    return
  }

  store.dispatch('helper/openModalLoading')

  const { hasUploadedU3mFile, u3mFile, needToGeneratePhysical } =
    refBlockMaterialUploadU3m.value
  await store.dispatch('assets/createMaterial', {
    tempMaterialId,
    hasCustomU3mUploading: hasUploadedU3mFile,
    u3mFile,
    needToGeneratePhysical,
  })

  store.dispatch('helper/closeModalLoading')

  isConfirmedToLeave.value = true
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-how-to-scan',
    properties: {
      header: t('DD0096'),
      title: t('DD0028'),
      primaryBtnText: t('UU0093'),
      secondaryBtnText: t('UU0092'),
      primaryHandler: () => {
        goToAssets()
        store.dispatch('helper/closeModalBehavior')
      },
      secondaryHandler: () => {
        goToMaterialUpload()
        store.dispatch('helper/closeModalBehavior')
      },
      materialList: [material.value],
    },
  })
}

const cancel = async () => {
  store.dispatch('helper/pushModalConfirm', {
    type: NOTIFY_TYPE.WARNING,
    header: t('DD0033'),
    contentText: t('DD0034'),
    primaryBtnText: t('UU0001'),
    primaryBtnHandler: () => {
      isConfirmedToLeave.value = true
      goToMaterialUpload()
    },
    secondaryBtnText: t('UU0002'),
  })
}

onBeforeRouteLeave(async () => {
  if (isConfirmedToLeave.value) {
    return true
  }
  const result = await new Promise((resolve) => {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('EE0045'),
      contentText: t('EE0046'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: resolve.bind(undefined, 'confirm'),
      secondaryBtnText: t('UU0002'),
      secondaryBtnHandler: resolve.bind(undefined, 'cancel'),
    })
  })

  return result === 'confirm'
})

store.dispatch('assets/resetMaterial')
await store.dispatch('assets/getMaterialOptions')
</script>

<template lang="pug">
div(data-scroll-to="block-material-information" class="pb-15 border-b border-grey-250")
  div(class="h-16 flex items-center justify-between")
    h5(class="text-h5 text-grey-900 font-bold") {{ $t('DD0013') }}
    f-button(
      v-if="isEditMode"
      size="sm"
      type="secondary"
      :disabled="hideSampleCard"
      @click="isOpenSampleCard = !isOpenSampleCard"
    ) {{ isOpenSampleCard ? $t('UU0026') : $t('UU0033') }}
  div
    div(class="flex")
      div(class="grid gap-y-7.5 flex-grow" :class="{ 'px-15': !isOpenSampleCard }")
        f-input-text(
          v-if="isEditMode"
          :textValue="material.frontierNo"
          :label="$t('RR0084')"
          disabled
          :clearable="false"
          class="w-50"
        )
        f-input-text(
          v-model:textValue="material.materialNo"
          :placeholder="$t('DD0015')"
          :label="$t('RR0013')"
          :hintError="invalidation.materialNo"
          required
          :rules="[$inputRules.required()]"
          data-cy="materialNo"
        )
        f-input-chips(
          v-model:selectValue="material.descriptionList"
          :dropdownMenuTree="specOptions.descriptionList"
          @addNew="addDescriptionOption($event)"
          :label="$t('RR0014')"
          :placeholder="$t('DD0016')"
          multiple
          widthFitWithInput
        )
        f-input-container(:label="$t('RR0015')" required)
          div(class="flex items-center gap-x-3")
            f-input-text(
              v-model:textValue="material.weight"
              inputType="number"
              class="w-69"
              data-cy="weight"
              :hintError="invalidation.weight"
              v-model:rightSelectValue="material.weightUnit"
              :rightDropdownOption="specOptions.weightUnitList"
            )
              template(#slot:right-dropdown-trigger="{ selectedMenu }")
                p {{ selectedMenu.title }}
            f-input-text(
              v-model:textValue="material.weightGy"
              inputType="number"
              :placeholder="$t('DD0017')"
              class="w-53.5"
              :hintError="invalidation.weightGy"
              :addOnRight="$t('RR0018')"
            )
        f-input-text(
          :label="$t('RR0019')"
          required
          v-model:textValue="material.width"
          inputType="number"
          class="w-60.5"
          data-cy="width"
          :hintError="invalidation.width"
          :addOnRight="$t('RR0020')"
        )
        f-input-container(
          :label="$t('RR0021')"
          required
          :hintError="invalidation.contentList"
        )
          div(class="grid gap-y-3")
            div(
              v-for="(content, contentItemIndex) in material.contentList"
              class="flex items-center"
            )
              f-input-chips(
                v-model:selectValue="content.name"
                @update:selectValue="selectContent($event, contentItemIndex)"
                :dropdownMenuTree="specOptions.contentList"
                @addNew="addContentOption($event)"
                :placeholder="$t('DD0016')"
                required
                class="w-100 mr-3"
                :style="{ zIndex: material.contentList.length - contentItemIndex }"
                widthFitWithInput
              )
              f-input-text(
                v-model:textValue="content.percentage"
                inputType="number"
                class="w-40 mr-3"
                data-cy="percentage"
                addOnRight="%"
              )
              f-svg-icon(
                v-if="contentItemIndex === 0"
                size="20"
                iconName="add_box"
                class="text-grey-600"
                @click="addNewContent"
                data-cy="add-content"
              )
              f-svg-icon(
                v-else
                size="20"
                iconName="delete"
                class="text-grey-600"
                @click="removeContent(contentItemIndex)"
              )
        f-input-chips(
          v-model:selectValue="material.finishList"
          :dropdownMenuTree="specOptions.finishList"
          @addNew="addFinishOption($event)"
          :label="$t('RR0022')"
          :placeholder="$t('DD0016')"
          multiple
          widthFitWithInput
        )
        f-input-container(:label="$t('RR0023')")
          div(class="flex items-center gap-x-3")
            f-input-text(
              v-model:textValue="material.warpYarnCount"
              :hintError="invalidation.warpYarnCount"
              class="w-50"
              data-cy="warpYarnCount"
            )
            f-svg-icon(iconName="clear" size="20" class="text-grey-900")
            f-input-text(
              v-model:textValue="material.weftYarnCount"
              :hintError="invalidation.weftYarnCount"
              class="w-50"
              data-cy="weftYarnCount"
            )
        f-input-container(:label="$t('RR0024')")
          div(class="flex items-center gap-x-3")
            f-input-text(
              v-model:textValue="material.warpDensity"
              :hintError="invalidation.warpDensity"
              class="w-50"
              data-cy="warpDensity"
            )
            f-svg-icon(iconName="clear" size="20" class="text-grey-900")
            f-input-text(
              v-model:textValue="material.weftDensity"
              :hintError="invalidation.weftDensity"
              class="w-50"
              data-cy="weftDensity"
            )
        f-input-container(:label="`${$t('RR0025')} / ${$t('RR0026')}`")
          div(class="flex items-center gap-x-3")
            f-input-text(
              v-model:textValue="material.pattern"
              :hintError="invalidation.pattern"
              class="w-50"
            )
            f-svg-icon(iconName="slash" size="20" class="text-grey-900")
            f-input-text(
              v-model:textValue="material.color"
              :hintError="invalidation.color"
              class="w-50"
            )
        f-input-chips(
          v-model:selectValue="material.publicTagList"
          :dropdownMenuTree="menuTreePublicTag"
          @addNew="addNew($event, menuTreePublicTag)"
          :label="$t('RR0027')"
          :placeholder="$t('DD0018')"
          multiple
          widthFitWithInput
        )
        div(v-if="isEditMode" class="relative")
          f-input-chips(
            v-model:selectValue="material.aiTagList"
            :dropdownMenuTree="menuTreeAiTag"
            @addNew="addNew($event, menuTreeAiTag)"
            :label="$t('RR0071')"
            :placeholder="$t('DD0018')"
            multiple
            widthFitWithInput
          )
          p(class="absolute right-0 top-0 text-caption text-grey-900") {{ $t('EE0036') }}
      div(v-if="isOpenSampleCard" class="flex-shrink-0 w-75 h-fit ml-8 sticky top-0")
        cropper-default-layout(
          v-if="isImageCropConfigReady"
          :showScale="true"
          :config="config"
          @update:rotateDeg="config.rotateDeg = $event"
          @update:scaleRatio="config.scaleRatio = $event / 100"
        )
          template(#imageCropArea)
            image-crop-area(
              :config="config"
              :cropRectSize="cropRectSize"
              @update:options="Object.assign(config.options, $event)"
            )
        div(v-else class="h-111 flex justify-center items-center")
          f-svg-icon(iconName="loading" size="54" class="text-primary-400")
    div(class="bg-grey-50 px-15 py-12.5 mt-7.5 grid gap-y-7.5")
      h6(class="text-h6 text-grey-600 font-bold") {{ $t('DD0019') }}
      f-input-chips(
        v-model:selectValue="material.privateTagList"
        :dropdownMenuTree="menuTreePrivateTag"
        @addNew="addNew($event, menuTreePrivateTag)"
        :label="$t('RR0028')"
        :placeholder="$t('DD0020')"
        multiple
        widthFitWithInput
      )
      f-input-textarea(
        v-model:textValue="material.remark"
        :label="$t('RR0029')"
        minHeight="min-h-27.5"
      )
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import useMaterialEdit from '@/composables/useMaterialEdit'
import useMaterialImage from '@/composables/useMaterialImage'
import ImageCropArea from '@/components/common/cropper/ImageCropArea.vue'
import CropperDefaultLayout from '@/components/common/cropper/CropperDefaultLayout.vue'
import { Cropper } from '@/utils/cropper'

defineProps({
  invalidation: {
    type: Object,
    required: true,
  },
})

const store = useStore()
const material = computed(() => store.getters['assets/material'])
const isEditMode = computed(() => !!material.value.materialId)
const { isBackSideMaterial, faceSideUrl, backSideUrl } = useMaterialImage(
  material.value
)
const { faceSideImg, backSideImg } = material.value
const isOpenSampleCard = ref(false)
const config = reactive({})
const isImageCropConfigReady = ref(false)
const cropRectSize = 300

const {
  specOptions,
  addContentOption,
  selectContent,
  addNewContent,
  removeContent,
  addDescriptionOption,
  addFinishOption,
} = useMaterialEdit()

const menuTreePublicTag = ref({
  blockList: [
    {
      menuList: material.value.publicTagList.map((tag) => ({
        title: tag,
        selectValue: tag,
      })),
    },
  ],
})
const menuTreeAiTag = ref({
  blockList: [
    {
      menuList: material.value.aiTagList.map((tag) => ({
        title: tag,
        selectValue: tag,
      })),
    },
  ],
})
const menuTreePrivateTag = ref({
  blockList: [
    {
      menuList: material.value.privateTagList.map((tag) => ({
        title: tag,
        selectValue: tag,
      })),
    },
  ],
})

const addNew = (newMenu, source) => {
  source.blockList[0].menuList.push({
    title: newMenu,
    selectValue: newMenu,
  })
}

const hideSampleCard = computed(() => {
  if (faceSideUrl) {
    return false
  } else if (isBackSideMaterial && backSideUrl) {
    return false
  } else {
    return true
  }
})

const getCropperConfig = async () => {
  if (!hideSampleCard.value) {
    const imageObj = faceSideUrl ? faceSideImg : backSideImg
    const cropper = new Cropper({
      src: imageObj.original,
      dpi: imageObj.dpi,
      cropRectSize,
    })
    await cropper.formatImage()
    Object.assign(config, cropper.config)
    isImageCropConfigReady.value = true
  }
}

getCropperConfig()

watch(
  () => material.value,
  () => {
    store.commit('assets/UPDATE_material', material.value)
  },
  {
    deep: true,
  }
)
</script>

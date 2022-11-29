<template lang="pug">
div(data-scroll-to="block-material-information" class="pb-15 border-b border-grey-200")
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
          :customErrorMsg="invalidation.materialNo"
          required
          :rules="[$inputRules.required()]"
          data-cy="materialNo"
        )
        f-input-chips(
          v-model:chips="material.descriptionList"
          :label="$t('RR0014')"
          :optionList="specOptions.descriptionList"
          :placeholder="$t('DD0016')"
          keyOptionDisplay="name"
          @addNewOption="addDescriptionOption($event)"
          canAddNewOption
          data-cy="descriptionList"
        )
        f-input-container(:label="$t('RR0015')" required)
          div(class="flex items-center gap-x-3")
            f-input-text(
              v-model:textValue="material.weight"
              inputType="number"
              class="w-50"
              data-cy="weight"
            )
              template(v-if="invalidation.weight" #slot:errorMsg)
                p(class="text-caption text-red-400 absolute pt-1 whitespace-nowrap") {{ invalidation.weight }}
            f-input-select(
              v-model:selectValue="material.weightUnit"
              :optionList="specOptions.weightUnitList"
              keyOptionDisplay="name"
              keyOptionValue="weightUnit"
              class="w-25"
            )
            f-input-text(
              v-model:textValue="material.weightGy"
              inputType="number"
              :placeholder="$t('DD0017')"
              class="w-50"
            )
              template(v-if="invalidation.weightGy" #slot:errorMsg)
                p(class="text-caption text-red-400 absolute pt-1 whitespace-nowrap") {{ invalidation.weightGy }}
            p(class="text-body2 text-grey-900 font-bold") {{ $t('RR0018') }}
        f-input-container(:label="$t('RR0019')" required)
          div(class="flex items-center gap-x-3")
            f-input-text(
              v-model:textValue="material.width"
              inputType="number"
              class="w-50"
              data-cy="width"
            )
              template(v-if="invalidation.width" #slot:errorMsg)
                p(class="text-caption text-red-400 absolute pt-1 whitespace-nowrap") {{ invalidation.width }}
            p(class="text-body2 text-grey-900 font-bold") {{ $t('RR0020') }}
        f-input-container(:label="$t('RR0021')" required)
          div(class="grid gap-y-3")
            div(
              v-for="(content, contentItemIndex) in material.contentList"
              class="flex items-center"
            )
              f-input-select(
                v-model:selectValue="content.name"
                :optionList="specOptions.contentList"
                :placeholder="$t('DD0016')"
                @select="selectContent($event, contentItemIndex)"
                @addNewOption="addContentOption($event)"
                keyOptionDisplay="name"
                keyOptionValue="name"
                searchBox
                canAddNewOption
                required
                class="w-100 mr-3"
                :style="{ zIndex: material.contentList.length - contentItemIndex }"
                data-cy="content"
              )
              f-input-text(
                v-model:textValue="content.percentage"
                inputType="number"
                class="w-25 mr-3"
                data-cy="percentage"
              )
              p(class="text-body2 text-grey-900 pr-7.5") %
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
          template(#slot:hint)
            p(
              v-if="invalidation.contentList"
              class="text-caption text-red-400 absolute pt-1"
              data-cy="error-msg"
            ) {{ invalidation.contentList }}
        f-input-chips(
          v-model:chips="material.finishList"
          :label="$t('RR0022')"
          :optionList="specOptions.finishList"
          :placeholder="$t('DD0016')"
          keyOptionDisplay="name"
          @addNewOption="addFinishOption($event)"
          canAddNewOption
          data-cy="finishList"
        )
        f-input-container(:label="$t('RR0023')")
          div(class="flex items-center gap-x-3")
            f-input-text(
              v-model:textValue="material.warpYarnCount"
              :customErrorMsg="invalidation.warpYarnCount"
              class="w-50"
              data-cy="warpYarnCount"
            )
            f-svg-icon(iconName="clear" size="20" class="text-grey-900")
            f-input-text(
              v-model:textValue="material.weftYarnCount"
              :customErrorMsg="invalidation.weftYarnCount"
              class="w-50"
              data-cy="weftYarnCount"
            )
        f-input-container(:label="$t('RR0024')")
          div(class="flex items-center gap-x-3")
            f-input-text(
              v-model:textValue="material.warpDensity"
              :customErrorMsg="invalidation.warpDensity"
              class="w-50"
              data-cy="warpDensity"
            )
            f-svg-icon(iconName="clear" size="20" class="text-grey-900")
            f-input-text(
              v-model:textValue="material.weftDensity"
              :customErrorMsg="invalidation.weftDensity"
              class="w-50"
              data-cy="weftDensity"
            )
        f-input-container(:label="`${$t('RR0025')} / ${$t('RR0026')}`")
          div(class="flex items-center gap-x-3")
            f-input-text(
              v-model:textValue="material.pattern"
              :customErrorMsg="invalidation.pattern"
              class="w-50"
            )
            f-svg-icon(iconName="slash" size="20" class="text-grey-900")
            f-input-text(
              v-model:textValue="material.color"
              :customErrorMsg="invalidation.color"
              class="w-50"
            )
        f-input-chips(
          v-model:chips="material.publicTagList"
          :label="$t('RR0027')"
          :placeholder="$t('DD0018')"
        )
        div(v-if="isEditMode" class="relative")
          f-input-chips(
            :label="$t('RR0071')"
            v-model:chips="material.aiTagList"
            :placeholder="$t('DD0018')"
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
        v-model:chips="material.privateTagList"
        :label="$t('RR0028')"
        :placeholder="$t('DD0020')"
      )
      f-input-textarea(
        v-model:textValue="material.remark"
        :label="$t('RR0029')"
        height="110"
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

const props = defineProps({
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
} = useMaterialEdit(material.value)

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

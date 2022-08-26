<template lang="pug">
div(class="pb-15 border-b border-black-400")
  div(class="h-16 flex items-center justify-between")
    h5(class="text-h5 text-primary font-bold") {{ $t("DD0013") }}
    btn(
      v-if="isEditMode"
      size="sm"
      type="secondary"
      :disabled="hideSampleCard"
      @click="isOpenSampleCard = !isOpenSampleCard"
    ) {{ isOpenSampleCard ? $t("UU0026") : $t("UU0033") }}
  div
    div(class="flex")
      div(class="grid gap-y-7.5 flex-grow" :class="{ 'px-15': !isOpenSampleCard }")
        input-text(
          v-if="isEditMode"
          :textValue="material.frontierNo"
          :label="$t('RR0084')"
          disabled
          :clearable="false"
          class="w-50"
        )
        input-text(
          v-model:textValue="material.materialNo"
          :placeholder="$t('DD0015')"
          :label="$t('RR0013')"
          :customErrorMsg="validations.materialNo"
          required
        )
        input-chips(
          v-model:chips="material.descriptionList"
          :label="$t('RR0014')"
          :options="specOptions.descriptionList"
          :placeholder="$t('DD0016')"
          keyOptionDisplay="name"
          keyOptionValue="name"
          @addNewOption="addDescriptionOption($event)"
        )
        input-container(:label="$t('RR0015')" required)
          div(class="flex items-center gap-x-3")
            input-text(
              v-model:textValue="material.weight"
              inputType="number"
              class="w-50"
            )
              template(v-if="validations.weight" #errorMsg)
                p(class="text-caption text-warn absolute pt-1 whitespace-nowrap") {{ validations.weight }}
            input-select(
              v-model:selectValue="material.weightUnit"
              :options="specOptions.weightUnitList"
              keyOptionDisplay="name"
              keyOptionValue="weightUnit"
              class="w-25"
            )
            input-text(
              v-model:textValue="material.weightGy"
              inputType="number"
              :placeholder="$t('DD0017')"
              class="w-50"
            )
              template(v-if="validations.weightGy" #errorMsg)
                p(class="text-caption text-warn absolute pt-1 whitespace-nowrap") {{ validations.weightGy }}
            p(class="text-body2 text-primary font-bold") {{ $t("RR0018") }}
        input-container(:label="$t('RR0019')" required)
          div(class="flex items-center gap-x-3")
            input-text(
              v-model:textValue="material.width"
              inputType="number"
              class="w-50"
            )
              template(v-if="validations.width" #errorMsg)
                p(class="text-caption text-warn absolute pt-1 whitespace-nowrap") {{ validations.width }}
            p(class="text-body2 text-primary font-bold") {{ $t("RR0020") }}
        input-container(:label="$t('RR0021')" required)
          div(class="grid gap-y-3")
            div(v-for="(content, contentItemIndex) in material.contentList" class="flex items-center")
              input-select(
                v-model:selectValue="content.name"
                :options="specOptions.contentList"
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
              )
              input-text(v-model:textValue="content.percentage" inputType="number" class="w-25 mr-3")
              p(class="text-body2 text-primary pr-7.5") %
              svg-icon(v-if="contentItemIndex === 0" size="20" iconName="add_box" class="text-black-700" @click="addNewContent")
              svg-icon(v-else size="20" iconName="delete" class="text-black-700" @click="removeContent(contentItemIndex)")
          template(#hint)
            p(v-if="validations.contentList" class="text-caption text-warn absolute pt-1") {{ validations.contentList }}
        input-chips(
          v-model:chips="material.finishList"
          :label="$t('RR0022')"
          :options="specOptions.finishList"
          :placeholder="$t('DD0016')"
          keyOptionDisplay="name"
          keyOptionValue="name"
          @addNewOption="addFinishOption($event)"
        )
        input-container(:label="$t('RR0023')")
          div(class="flex items-center gap-x-3")
            input-text(
              v-model:textValue="material.warpYarnCount"
              :customErrorMsg="validations.warpYarnCount"
              class="w-50"
            )
            svg-icon(iconName="clear" size="20" class="text-primary")
            input-text(
              v-model:textValue="material.weftYarnCount"
              :customErrorMsg="validations.weftYarnCount"
              class="w-50"
            )
        input-container(:label="$t('RR0024')")
          div(class="flex items-center gap-x-3")
            input-text(
              v-model:textValue="material.warpDensity"
              :customErrorMsg="validations.warpDensity"
              class="w-50"
            )
            svg-icon(iconName="clear" size="20" class="text-primary")
            input-text(
              v-model:textValue="material.weftDensity"
              :customErrorMsg="validations.weftDensity"
              class="w-50"
            )
        input-container(:label="`${$t('RR0025')} / ${$t('RR0026')}`")
          div(class="flex items-center gap-x-3")
            input-text(
              v-model:textValue="material.pattern"
              :customErrorMsg="validations.pattern"
              class="w-50"
            )
            svg-icon(iconName="slash" size="20" class="text-primary")
            input-text(
              v-model:textValue="material.color"
              :customErrorMsg="validations.color"
              class="w-50"
            )
        input-chips(
          v-model:chips="material.publicTagList"
          :label="$t('RR0027')"
          :placeholder="$t('DD0018')"
        )
        div(v-if="isEditMode" class="relative")
          input-chips(
            :label="$t('RR0071')"
            v-model:chips="material.aiTagList"
            :placeholder="$t('DD0018')"
          )
          p(class="absolute right-0 top-0 text-caption text-primary") {{ $t("EE0036") }}
      div(v-if="isOpenSampleCard" class="flex-shrink-0 w-75 h-fit ml-8 sticky top-0")
        cropper-default-layout(
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
    div(class="bg-black-100 px-15 py-12.5 mt-7.5 grid gap-y-7.5")
      h6(class="text-h6 text-black-600 font-bold") {{ $t("DD0019") }}
      input-chips(
        v-model:chips="material.privateTagList"
        :label="$t('RR0028')"
        :placeholder="$t('DD0020')"
      )
      input-textarea(
        v-model:textValue="material.remark"
        :label="$t('RR0029')"
        height="110"
      )
</template>

<script setup>
import { ref, computed, watch, reactive, onMounted } from 'vue'
import { SIDE_TYPE } from '@/utils/constants'
import { useStore } from 'vuex'
import useMaterialEdit from '@/composables/useMaterialEdit'
import useMaterialImage from '@/composables/useMaterialImage'
import ImageCropArea from '@/components/common/cropper/ImageCropArea.vue'
import CropperDefaultLayout from '@/components/common/cropper/CropperDefaultLayout.vue'
import { Cropper } from '@/utils/cropper'

const props = defineProps({
  validations: {
    type: Object,
    required: true
  }
})

const store = useStore()
const material = computed(() => store.getters['assets/material'])
const isEditMode = computed(() => material.value.materialId !== null)
const { isBackSideMaterial, faceSideUrl, backSideUrl } = useMaterialImage(material.value)
const { faceSideImg, backSideImg } = material.value
const isOpenSampleCard = ref(false)
const config = reactive({})
const cropRectSize = 300

const {
  specOptions,
  addContentOption,
  selectContent,
  addNewContent,
  removeContent,
  addDescriptionOption,
  addFinishOption
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
      cropRectSize
    })
    await cropper.formatImage()
    Object.assign(config, cropper.config)
  }
}

onMounted(async () => {
  await getCropperConfig()
})

watch(
  () => material.value,
  () => {
    store.commit('assets/UPDATE_material', material.value)
  },
  {
    deep: true
  }
)
</script>

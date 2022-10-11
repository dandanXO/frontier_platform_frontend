<template lang="pug">
div(class="grid gap-y-7.5")
  f-input-text(
    v-model:textValue="material.materialNo"
    :placeholder="$t('DD0015')"
    :label="$t('RR0013')"
    :customErrorMsg="validations.materialNo"
    required
    :rules="[$inputRules.required()]"
  )
  f-input-chips(
    v-model:chips="material.descriptionList"
    :label="$t('RR0014')"
    :optionList="specOptions.descriptionList"
    :placeholder="$t('DD0016')"
    keyOptionDisplay="name"
    @addNewOption="addDescriptionOption($event)"
    canAddNewOption
  )
  f-input-container(:label="$t('RR0021')" required)
    div(class="grid gap-y-3")
      div(v-for="(content, contentItemIndex) in material.contentList" class="flex items-center")
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
        )
        f-input-text(v-model:textValue="content.percentage" inputType="number" class="w-25 mr-3")
        p(class="text-body2 text-grey-900 pr-7.5") %
        f-svg-icon(v-if="contentItemIndex === 0" size="20" iconName="add_box" class="text-grey-600" @click="addNewContent")
        f-svg-icon(v-else size="20" iconName="delete" class="text-grey-600" @click="removeContent(contentItemIndex)")
    template(#slot:hint)
      p(v-if="validations.contentList" class="text-caption text-red-400 absolute pt-1") {{ validations.contentList }}
  f-input-container(:label="$t('RR0023')")
    div(class="flex items-center gap-x-3")
      f-input-text(
        v-model:textValue="material.warpYarnCount"
        :customErrorMsg="validations.warpYarnCount"
        class="w-50"
      )
      f-svg-icon(iconName="clear" size="20" class="text-grey-900")
      f-input-text(
        v-model:textValue="material.weftYarnCount"
        :customErrorMsg="validations.weftYarnCount"
        class="w-50"
      )
  f-input-container(:label="$t('RR0024')")
    div(class="flex items-center gap-x-3")
      f-input-text(
        v-model:textValue="material.warpDensity"
        :customErrorMsg="validations.warpDensity"
        class="w-50"
      )
      f-svg-icon(iconName="clear" size="20" class="text-grey-900")
      f-input-text(
        v-model:textValue="material.weftDensity"
        :customErrorMsg="validations.weftDensity"
        class="w-50"
      )
  f-input-container(:label="`${$t('RR0025')} / ${$t('RR0026')}`")
    div(class="flex items-center gap-x-3")
      f-input-text(
        v-model:textValue="material.pattern"
        :customErrorMsg="validations.pattern"
        class="w-50"
      )
      f-svg-icon(iconName="slash" size="20" class="text-grey-900")
      f-input-text(
        v-model:textValue="material.color"
        :customErrorMsg="validations.color"
        class="w-50"
      )
  f-input-container(:label="$t('RR0015')" required)
    div(class="flex items-center gap-x-3")
      f-input-text(
        v-model:textValue="material.weight"
        inputType="number"
        :customErrorMsg="validations.weight"
        class="w-50"
      )
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
      p(class="text-body2 text-grey-900 font-bold") {{ $t("RR0018") }}
  f-input-container(:label="$t('RR0019')" required)
    div(class="flex items-center gap-x-3")
      f-input-text(
        v-model:textValue="material.width"
        :customErrorMsg="validations.width"
        inputType="number"
        class="w-50"
      )
      p(class="text-body2 text-grey-900 font-bold") {{ $t("RR0020") }}
  f-input-chips(
    v-model:chips="material.finishList"
    :label="$t('RR0022')"
    :optionList="specOptions.finishList"
    :placeholder="$t('DD0016')"
    keyOptionDisplay="name"
    @addNewOption="addFinishOption($event)"
    canAddNewOption
  )
</template>

<script>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import useMaterialEdit from '@/composables/useMaterialEdit'

export default {
  name: 'SimpleSpec',
  props: {
    validations: {
      type: Object,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const material = computed(() => store.getters['assets/material'])

    const {
      specOptions,
      addContentOption,
      selectContent,
      addNewContent,
      removeContent,
      addDescriptionOption,
      addFinishOption
    } = useMaterialEdit(material.value)

    watch(
      () => material.value,
      () => {
        store.commit('assets/UPDATE_material', material.value)
      },
      {
        deep: true
      }
    )

    return {
      specOptions,
      material,
      addContentOption,
      selectContent,
      addNewContent,
      removeContent,
      addDescriptionOption,
      addFinishOption
    }
  }
}
</script>

<template lang="pug">
div(class="grid gap-y-7.5")
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
    class="relative z-13"
  )
  input-container(:label="$t('RR0021')" required class="relative z-10")
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
          :class="`z-${material.contentList.length - contentItemIndex}`"
        )
        input-text(v-model:textValue="content.percentage" inputType="number" class="w-25 mr-3")
        p(class="text-body2 text-primary pr-7.5") %
        svg-icon(v-if="contentItemIndex === 0" size="20" iconName="add_box" class="text-black-700" @click="addNewContent")
        svg-icon(v-else size="20" iconName="delete" class="text-black-700" @click="removeContent(contentItemIndex)")
    template(#hint)
      p(v-if="validations.contentList" class="text-caption text-warn absolute pt-1") {{validations.contentList}}
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
  input-container(:label="$t('RR0015')" required class="relative z-12")
    div(class="flex items-center gap-x-3")
      input-text(
        v-model:textValue="material.weight"
        inputType="number"
        :customErrorMsg="validations.weight"
        class="w-50"
      )
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
      p(class="text-body2 text-primary font-bold") {{$t('RR0018')}}
  input-container(:label="$t('RR0019')" required class="relative z-11")
    div(class="flex items-center gap-x-3")
      input-text(
        v-model:textValue="material.width"
        :customErrorMsg="validations.width"
        inputType="number"
        class="w-50"
      )
      p(class="text-body2 text-primary font-bold") {{$t('RR0020')}}
  input-chips(
    v-model:chips="material.finishList"
    :label="$t('RR0022')"
    :options="specOptions.finishList"
    :placeholder="$t('DD0016')"
    keyOptionDisplay="name"
    keyOptionValue="name"
    @addNewOption="addFinishOption($event)"
    class="relative z-9"
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

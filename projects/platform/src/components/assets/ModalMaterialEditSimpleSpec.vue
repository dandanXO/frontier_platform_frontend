<template lang="pug">
modal-behavior(
  :header="`${material.materialNo} - ${$t('RR0130')}`"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="updateMaterialSimpleSpec"
  @click:secondary="$store.dispatch('helper/closeModal')"
)
  div(class="min-w-200 grid gap-y-7.5")
    f-input-text(
      v-model:textValue="material.materialNo"
      :placeholder="$t('DD0015')"
      :label="$t('RR0013')"
      :hintError="invalidation.materialNo"
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
          f-input-text(
            v-model:textValue="content.percentage"
            inputType="number"
            class="w-40 mr-3"
            addOnRight="%"
          )
          f-svg-icon(
            v-if="contentItemIndex === 0"
            size="20"
            iconName="add_box"
            class="text-grey-600"
            @click="addNewContent"
          )
          f-svg-icon(
            v-else
            size="20"
            iconName="delete"
            class="text-grey-600"
            @click="removeContent(contentItemIndex)"
          )
    f-input-container(:label="$t('RR0023')")
      div(class="flex items-center gap-x-3")
        f-input-text(
          v-model:textValue="material.warpYarnCount"
          :hintError="invalidation.warpYarnCount"
          class="w-50"
        )
        f-svg-icon(iconName="clear" size="20" class="text-grey-900")
        f-input-text(
          v-model:textValue="material.weftYarnCount"
          :hintError="invalidation.weftYarnCount"
          class="w-50"
        )
    f-input-container(:label="$t('RR0024')")
      div(class="flex items-center gap-x-3")
        f-input-text(
          v-model:textValue="material.warpDensity"
          :hintError="invalidation.warpDensity"
          class="w-50"
        )
        f-svg-icon(iconName="clear" size="20" class="text-grey-900")
        f-input-text(
          v-model:textValue="material.weftDensity"
          :hintError="invalidation.weftDensity"
          class="w-50"
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
    f-input-container(:label="$t('RR0015')" required)
      div(class="flex items-center gap-x-3")
        f-input-text(
          v-model:textValue="material.weight"
          inputType="number"
          :hintError="invalidation.weight"
          class="w-50"
          v-model:rightSelectValue="material.weightUnit"
          :rightDropdownOption="specOptions.weightUnitList"
        )
          template(#slot:right-dropdown-trigger="{ selectedMenu }")
            p {{ selectedMenu.title }}
        f-input-text(
          v-model:textValue="material.weightGy"
          inputType="number"
          :placeholder="$t('DD0017')"
          class="w-50"
          :addOnRight="$t('RR0018')"
        )
    f-input-text(
      :label="$t('RR0019')"
      required
      v-model:textValue="material.width"
      :hintError="invalidation.width"
      inputType="number"
      class="w-50"
      :addOnRight="$t('RR0020')"
    )
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

<script setup>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import useMaterialEdit from '@/composables/useMaterialEdit'
import useMaterialValidation from '@/composables/useMaterialValidation'

const store = useStore()
const material = computed(() => store.getters['assets/material'])
const { invalidation, validate } = useMaterialValidation(material, [
  'materialNo',
  'contentList',
  'warpYarnCount',
  'weftYarnCount',
  'warpDensity',
  'weftDensity',
  'pattern',
  'color',
  'weight',
  'width',
])

const {
  specOptions,
  addContentOption,
  selectContent,
  addNewContent,
  removeContent,
  addDescriptionOption,
  addFinishOption,
} = useMaterialEdit()

watch(
  () => material.value,
  () => {
    store.commit('assets/UPDATE_material', material.value)
  },
  {
    deep: true,
  }
)

const updateMaterialSimpleSpec = async () => {
  if (!validate()) {
    return
  }
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('assets/updateMaterialSimpleSpec')
  store.dispatch('helper/clearModalPipeline')
  store.dispatch('helper/reloadInnerApp')
}

await store.dispatch('assets/getMaterialOptions')
</script>

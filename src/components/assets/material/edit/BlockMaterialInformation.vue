<template lang="pug">
div(class="pb-15 border-b border-black-400")
  div(class="h-16 flex items-center justify-between")
    h5(class="text-h5 text-primary font-bold") {{$t('DD0013')}}
    btn(v-if="isEditMode" size="sm" type="secondary" @click="isOpenSampleCard = !isOpenSampleCard") {{isOpenSampleCard ? $t('Close') : $t('Sample Card Display')}}
  div
    div(class="flex")
      div(class="grid gap-y-7.5 flex-grow" :class="{ 'px-15': !isOpenSampleCard }")
        div(v-if="!isEditMode" class="flex items-center")
          input-switch(v-model:inputValue="material.isDoubleSideMaterial" name="Dobule-side")
          div(v-if="!material.isDoubleSideMaterial" class="flex gap-x-1 pl-3.5")
            input-radio(
              v-model:inputValue="material.sideType"
              :name="$t('DD0048')"
              :value="SIDE_TYPE.FACE"
              size="20"
            )
            input-radio(
              v-model:inputValue="material.sideType"
              :name="$t('DD0049')"
              :value="SIDE_TYPE.BACK"
              size="20"
            )
        input-text(
          v-model:textValue="material.materialNo"
          :placeholder="$t('DD0015')"
          :label="$t('RR0013')"
          :customErrorMsg="validations.materialNo"
        )
        input-chips(
          v-model:chips="material.descriptionList"
          :label="$t('RR0014')"
          :options="options.descriptionList"
          :placeholder="$t('DD0016')"
          keyOptionDisplay="name"
          keyOptionValue="name"
          @addNewOption="addDescriptionOption($event)"
          class="relative z-13"
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
              :options="options.weightUnitList"
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
              inputType="number"
              class="w-50"
            )
            p(class="text-body2 text-primary font-bold") {{$t('RR0020')}}
        input-container(:label="$t('RR0021')" required class="relative z-10")
          div(class="grid gap-y-3")
            div(v-for="(content, contentItemIndex) in material.contentList" class="flex items-center")
              input-select(
                v-model:selectValue="content.name"
                :options="options.contentList"
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
        input-chips(
          v-model:chips="material.finishList"
          :label="$t('RR0022')"
          :options="options.finishList"
          :placeholder="$t('DD0016')"
          keyOptionDisplay="name"
          keyOptionValue="name"
          @addNewOption="addFinishOption($event)"
          class="relative z-9"
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
          class="relative z-9"
        )
      div(v-if="isOpenSampleCard" class="w-75 h-75 bg-black-200 ml-8 sticky top-0")
    div(class="bg-black-100 px-15 py-12.5 mt-7.5 grid gap-y-7.5")
      h6(class="text-h6 text-black-600 font-bold") {{$t('DD0019')}}
      input-chips(
        v-model:chips="material.privateTagList"
        :label="$t('RR0028')"
        :placeholder="$t('DD0020')"
        class="relative z-8"
      )
      input-textarea(
        v-model:textValue="material.remark"
        :label="$t('RR0029')"
        height="110"
      )
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { SIDE_TYPE, WEIGHT_UNIT } from '@/utils/constants'
import { useStore } from 'vuex'

export default {
  name: 'BlockMaterialInformation',
  props: {
    validations: {
      type: Object,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const material = computed(() => store.getters['material/material'])
    const isEditMode = computed(() => material.value.materialId !== null)
    const newContentList = reactive([])
    const newDescriptionList = reactive([])
    const newFinishList = reactive([])
    const isOpenSampleCard = ref(false)
    const options = reactive({
      contentList: computed(() => {
        const originalContentList = store.getters['material/code'].contentList.slice(0, 10)
        return originalContentList
          .concat(newContentList)
      }),
      weightUnitList: computed(() => {
        return Object.keys(WEIGHT_UNIT)
          .map(key => ({
            weightUnit: WEIGHT_UNIT[key],
            name: key.toLowerCase()
          }))
      }),
      descriptionList: computed(() => {
        return store.getters['material/code'].descriptionList.slice(0, 10)
          .concat(newDescriptionList)
      }),
      finishList: computed(() => {
        return store.getters['material/code'].finishList.slice(0, 10)
          .concat(newFinishList)
      })
    })

    const addDescriptionOption = (descriptionName) => {
      newDescriptionList.push({
        descriptionId: null,
        name: descriptionName
      })
    }

    const addFinishOption = (finishName) => {
      newFinishList.push({
        finishId: null,
        name: finishName
      })
    }

    const addContentOption = (contentName) => {
      newContentList.push({
        contentId: null,
        name: contentName
      })
    }

    const selectContent = (contentName, contentItemIndex) => {
      const content = options.contentList.find(content => content.name === contentName)
      store.commit('material/UPDATE_content_item', { index: contentItemIndex, content })
    }

    const addNewContent = () => {
      store.commit('material/ADD_content_item')
    }

    const removeContent = (contentItemIndex) => {
      store.commit('material/REMOVE_content_item', contentItemIndex)
    }

    watch(
      () => material.value,
      () => {
        store.commit('material/UPDATE_material', material.value)
      },
      {
        deep: true
      }
    )

    return {
      options,
      addContentOption,
      selectContent,
      addNewContent,
      removeContent,
      SIDE_TYPE,
      material,
      addDescriptionOption,
      addFinishOption,
      isEditMode,
      isOpenSampleCard
    }
  }
}
</script>

<template lang="pug">
div
  div(class="h-16 flex items-center")
    h5(class="text-h5 text-primary") {{$t('DD0013')}}
  div(class="px-15 grid gap-y-7.5")
    div(class="flex items-center")
      input-switch(v-model:inputValue="form.isDoubleSide" name="Dobule-side")
      div(v-if="!form.isDoubleSide" class="flex gap-x-1 pl-3.5")
        input-radio(
          v-model:inputValue="form.sideType"
          :name="$t('DD0048')"
          :value="SIDE_TYPE.FACE"
          size="20"
        )
        input-radio(
          v-model:inputValue="form.sideType"
          :name="$t('DD0049')"
          :value="SIDE_TYPE.BACK"
          size="20"
        )
    input-text(
      v-model:textValue="form.materialNo"
      :placeholder="$t('DD0015')"
      :label="$t('RR0013')"
      required
    )
    input-chips(
      v-model:chips="form.descriptionList"
      :label="$t('RR0014')"
      :options="options.contentList"
      :placeholder="$t('DD0016')"
      @addNewOption="addContentOption($event)"
      class="relative z-13"
    )
    input-container(:label="$t('RR0015')" required class="relative z-12")
      template(#input)
        div(class="flex items-center gap-x-3")
          input-text(
            v-model:textValue="form.weight"
            inputType="number"
            class="w-50"
          )
          input-select(
            v-model:selectValue="form.weightUnit"
            :options="options.weightUnitList"
            keyOptionDisplay="name"
            keyOptionValue="weightUnit"
            class="w-25"
          )
          input-text(
            v-model:textValue="form.weightGy"
            inputType="number"
            :placeholder="$t('DD0017')"
            class="w-50"
          )
          p(class="text-body2 text-primary font-bold") {{$t('RR0018')}}
    input-container(:label="$t('RR0019')" required class="relative z-11")
      template(#input)
        div(class="flex items-center gap-x-3")
          input-text(
            v-model:textValue="form.width"
            inputType="number"
            class="w-50"
          )
          p(class="text-body2 text-primary font-bold") {{$t('RR0020')}}
    input-container(:label="$t('RR0021')" required class="relative z-10")
      template(#input)
        div(class="grid gap-y-3")
          div(v-for="(content, selectInputIndex) in form.contentList" class="flex items-center")
            input-select(
              v-model:selectValue="content.index"
              :options="options.contentList"
              :placeholder="$t('DD0016')"
              @select="selectContent($event, selectInputIndex)"
              @addNewOption="addContentOption($event)"
              keyOptionDisplay="name"
              keyOptionValue="index"
              searchBox
              canAddNewOption
              required
              class="w-100 mr-3"
              :class="`z-${form.contentList.length - selectInputIndex}`"
            )
            input-text(v-model:textValue="content.percentage" inputType="number" class="w-25 mr-3")
            p(class="text-body2 text-primary pr-7.5") %
            svg-icon(v-if="selectInputIndex === 0" size="20" iconName="add_box" class="text-black-700" @click="addNewContent")
            svg-icon(v-else size="20" iconName="delete" class="text-black-700" @click="removeContent(selectInputIndex)")
    input-chips(
      v-model:chips="form.finishList"
      :label="$t('RR0022')"
      :options="options.contentList"
      :placeholder="$t('DD0016')"
      @addNewOption="addContentOption($event)"
      class="relative z-9"
    )
    input-container(:label="$t('RR0023')")
      template(#input)
        div(class="flex items-center gap-x-3")
          input-text(
            v-model:textValue="form.warpYarnCount"
            class="w-50"
          )
          svg-icon(iconName="clear" size="20" class="text-primary")
          input-text(
            v-model:textValue="form.weftYarnCount"
            class="w-50"
          )
    input-container(:label="$t('RR0024')")
      template(#input)
        div(class="flex items-center gap-x-3")
          input-text(
            v-model:textValue="form.warpDensity"
            class="w-50"
          )
          svg-icon(iconName="clear" size="20" class="text-primary")
          input-text(
            v-model:textValue="form.weftDensity"
            class="w-50"
          )
    input-container(:label="`${$t('RR0025')} / ${$t('RR0026')}`")
      template(#input)
        div(class="flex items-center gap-x-3")
          input-text(
            v-model:textValue="form.pattern"
            class="w-50"
          )
          svg-icon(iconName="slash" size="20" class="text-primary")
          input-text(
            v-model:textValue="form.color"
            class="w-50"
          )
    input-chips(
      v-model:chips="form.publicTagList"
      :label="$t('RR0027')"
      :placeholder="$t('DD0018')"
      class="relative z-9"
    )
    div(class="-mx-15 bg-black-100 px-15 py-12.5 grid gap-y-7.5")
      h6(class="text-h6 text-black-600 font-bold") {{$t('DD0019')}}
      input-chips(
        v-model:chips="form.privateTagList"
        :label="$t('RR0028')"
        :placeholder="$t('DD0020')"
        class="relative z-8"
      )
      input-textarea(
        v-model:textValue="form.remark"
        :label="$t('RR0029')"
        height="110"
      )
</template>

<script>
import { reactive, computed } from 'vue'
import { SIDE_TYPE, WEIGHT_UNIT } from '@/utils/constants'

export default {
  name: 'BlockMaterialInformation',
  setup () {
    const defaultState = {
      content: { index: -1, contentId: -1, name: '', percentage: '' }
    }
    const form = reactive({
      isDoubleSide: false,
      sideType: SIDE_TYPE.FACE,
      materialNo: '',
      contentList: [{ ...defaultState.content }],
      descriptionList: [],
      width: '',
      weight: '',
      weightUnit: WEIGHT_UNIT.GSM,
      weightGy: '',
      finishList: [],
      warpYarnCount: '',
      weftYarnCount: '',
      warpDensity: '',
      weftDensity: '',
      pattern: '',
      color: '',
      publicTagList: [],
      privateTagList: [],
      remark: ''
    })

    const options = reactive({
      contentList: computed(() => {
        const originalContentList = [
          {
            contentId: 1,
            name: 'C'
          },
          {
            contentId: 2,
            name: 'CD'
          },
          {
            contentId: 3,
            name: 'recycled cotton'
          },
          {
            contentId: 4,
            name: 'Cotton'
          },
          {
            contentId: 5,
            name: 'Spandex'
          },
          {
            contentId: 6,
            name: 'Linen'
          },
          {
            contentId: 7,
            name: 'Polyester'
          },
          {
            contentId: 8,
            name: 'Rayon'
          },
          {
            contentId: 9,
            name: 'Nylon'
          }
        ]
        return originalContentList
          .concat(newContentList)
          .map((content, index) => ({ index, ...content }))
      }),
      weightUnitList: computed(() => {
        return Object.keys(WEIGHT_UNIT)
          .map(key => ({
            weightUnit: WEIGHT_UNIT[key],
            name: key.toLowerCase()
          }))
      })
    })

    const newContentList = reactive([])

    const addContentOption = (contentName) => {
      newContentList.push({
        contentId: null,
        name: contentName
      })
    }

    const selectContent = (contentIndex, selectInputIndex) => {
      Object.assign(form.contentList[selectInputIndex], options.contentList[contentIndex])
    }

    const addNewContent = () => {
      form.contentList.push({ ...defaultState.content })
    }

    const removeContent = (selectInputIndex) => {
      form.contentList.splice(selectInputIndex, 1)
    }

    return {
      form,
      options,
      addContentOption,
      selectContent,
      addNewContent,
      removeContent,
      SIDE_TYPE
    }
  }
}
</script>

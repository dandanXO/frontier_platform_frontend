<template lang="pug">
filter-wrapper(
  iconName="ingredient"
  :displayName="$t('RR0021')"
  :dirty="filterDirty.contentList"
  @expand="init"
)
  div(class="w-120.5 py-4 rounded card-shadow")
    div(class="px-5")
      div(class="flex justify-between items-center")
        div(class="flex items-center gap-x-2")
          p(class="text-body2 text-grey-900 font-bold") {{ $t('RR0021') }}
          f-button-label(
            v-if="contentList.length > 0"
            size="sm"
            @click.stop="reset"
          ) {{ $t('UU0040') }}
        f-svg-icon(size="20" iconName="add_box" class="text-grey-600" @click="addItem")
      div(v-if="contentList.length > 0" class="grid gap-y-5 relative py-2")
        div(v-for="(content, contentItemIndex) in contentList" class="flex items-center")
          f-select-dropdown(
            v-model:selectValue="content.name"
            :dropdownMenuTree="menuTree"
            :placeholder="$t('JJ0001')"
            class="w-64 mr-3"
            :style="{ zIndex: contentList.length - contentItemIndex }"
          )
          f-input-text(
            v-model:textValue="content.percentage"
            inputType="number"
            class="w-30 mr-3"
          )
          p(class="text-body2 text-grey-900 pr-2") %
          f-svg-icon(
            size="20"
            iconName="delete"
            class="text-grey-600"
            @click.stop="removeItem(contentItemIndex)"
          )
        p(
          v-if="errorMsg"
          class="text-caption text-red-400 absolute bottom-0 transform translate-y-full"
        ) {{ errorMsg }}
      div(class="flex pt-4")
        f-svg-icon(iconName="error_outline" size="14" class="text-grey-900 mt-1 mr-2")
        div(class="text-caption text-grey-900 leading-1.6")
          p {{ $t('JJ0002') }}:
          p {{ $t('JJ0003') }}
          p {{ $t('JJ0004') }}
    div(class="px-5 mt-2 flex items-center justify-end")
      f-button(
        size="sm"
        :disabled="errorMsg"
        class="justify-self-center"
        @click="update"
      ) {{ $t('UU0001') }}
</template>

<script>
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'FilterContent',
  components: {
    FilterWrapper,
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()

    const filterDirty = computed(
      () => store.getters['helper/search/filterDirty']
    )

    const menuTree = computed(() => {
      const { contentList } = store.getters['code/filterOptionList']
      return {
        width: 'w-64',
        blockList: [
          {
            menuList: contentList.map(({ displayName, value }) => ({
              title: displayName,
              selectValue: value,
            })),
          },
        ],
      }
    })

    const contentList = ref([])

    const errorMsg = computed(() => {
      let total = 0
      for (let i = 0; i < contentList.value.length; i++) {
        const { name, percentage } = contentList.value[i]

        if (name === null) {
          return t('WW0002')
        }

        const maxIntegerDecimal = (maxInteger, maxDecimal, v) => {
          if (!v) {
            return false
          }

          const [integer, decimal] = String(v).split('.')
          return integer?.length > maxInteger || decimal?.length > maxDecimal
        }

        if (maxIntegerDecimal(3, 2, percentage)) {
          return t('WW0010')
        }

        total += percentage
      }
      if (total > 100) {
        return t('WW0060')
      }

      return false
    })

    const contentItem = () => ({
      name: null,
      percentage: null,
    })

    const addItem = () => contentList.value.push(contentItem())
    const removeItem = (index) => contentList.value.splice(index, 1)
    const reset = () => {
      contentList.value.length = 0
    }

    const init = () => {
      const filter = store.getters['helper/search/filter']
      contentList.value =
        filter.contentList.length > 0
          ? JSON.parse(JSON.stringify(filter.contentList))
          : []
    }

    const update = () => {
      contentList.value.forEach((content) => {
        if (content.percentage === '') {
          content.percentage = null
        }
      })
      store.dispatch('helper/search/setFilter', {
        contentList:
          contentList.value.length > 0
            ? JSON.parse(JSON.stringify(contentList.value))
            : [],
      })
    }

    return {
      contentList,
      filterDirty,
      menuTree,
      addItem,
      removeItem,
      reset,
      init,
      update,
      errorMsg,
    }
  },
}
</script>

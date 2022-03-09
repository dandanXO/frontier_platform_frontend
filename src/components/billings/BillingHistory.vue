<template lang="pug">
div(class="w-full mt-4")
  general-table(
    v-model:pagination="pagination"
    v-model:keyword="keyword"
    :headers="headers"
    :items="tableData"
    :emptyText="$t('RR0105')"
    @search="getList()"
    @sort="getList()"
    @goTo="getList($event)"
    filterable
    searchable
  )
    template(#filter)
      div(class="pt-4 pb-3 px-5")
        div(class="flex items-center mb-2")
          p(class="text-black-700 text-body2 mr-1.5") {{$t("OO0117")}}
          btn-functional(@click="clearDate") {{$t("UU0040")}}
        div(class="mr-4 flex items-center")
          input-text(
            v-model:textValue="queryParams.startDate"
            inputType="date"
            :clearable="false"
            size="sm"
            @change="getList()"
          )
          span(class="text-body1 text-primary mx-2") ~
          input-text(
            v-model:textValue="queryParams.endDate"
            inputType="date"
            :clearable="false"
            size="sm"
            @change="getList()"
          )
      div(class="border-t border-black-200")
      div(class="pt-4 pb-6 px-5")
        div(class="flex items-center mb-2")
          p(class="text-black-700 text-body2 mr-1.5") {{$t("OO0118")}}
          btn-functional(@click="changeCategory(BILLING_CATEGORY.ALL)") {{$t("UU0040")}}
        div(class="flex")
          div(
            v-for="(category, index) in categoryOptions"
            class="text-primary text-body2 cursor-pointer flex"
            :class="{'text-brand': queryParams.category === category.value}"
            @click="changeCategory(category.value)"
          ) {{category.label}}
            div(v-if="index !== categoryOptions.length - 1" class="border-r border-primary-middle h-full mx-4")
    template(v-slot="{item, prop, isHover}")
      div(v-if="prop === 'download'" class="flex justify-center items-center")
        svg-icon(iconName="picture_as_pdf" class="text-assist-blue cursor-pointer" @click="generatePdf(item.invoiceId)")
      div(v-if="prop === 'view'" class="flex justify-center items-center")
        svg-icon(v-show="isHover" iconName="visibility" class="cursor-pointer text-black-600"  @click="openModalViewInvoice(item.invoiceId)")
</template>

<script>
import { BILLING_CATEGORY, BILLING_SORT } from '@/utils/constants'
import { reactive, ref } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default {
  name: 'BillingHistory',
  async setup () {
    const { t } = useI18n()
    const store = useStore()
    const tableData = ref([])
    const pagination = ref({
      sort: BILLING_SORT.NEWEST_FIRST,
      currentPage: 1,
      totalPage: 1,
      perPageCount: 8
    })
    const keyword = ref('')
    const queryParams = reactive({
      category: BILLING_CATEGORY.ALL,
      startDate: '',
      endDate: ''
    })

    const categoryOptions = [
      {
        label: t('OO0086'),
        value: BILLING_CATEGORY.SUBSCRIPTION
      }, {
        label: t('OO0087'),
        value: BILLING_CATEGORY.U3M
      }
    ]

    const headers = [
      {
        prop: 'invoiceNumber',
        label: t("OO0081"),
        width: '20%'
      },
      {
        prop: 'date',
        label: t("OO0082"),
        width: '20%',
        sortBy: [BILLING_SORT.NEWEST_FIRST, BILLING_SORT.OLDEST_FIRST]
      },
      {
        prop: 'title',
        label: t("OO0083"),
        width: '30%'
      },
      {
        prop: 'download',
        label: t("OO0084"),
        width: '14%'
      },
      {
        prop: 'view',
        label: '',
        width: '16%'
      }
    ]
    const getList = async (targetPage = 1) => {
      const result = await store.dispatch('organization/getInvoiceList', {
        ...queryParams,
        keyword: keyword.value,
        pagination: {
          perPageCount: pagination.value.perPageCount,
          sort: pagination.value.sort,
          targetPage
        }
      })
      tableData.value = result.invoiceList
      pagination.value = result.pagination
    }

    const clearDate = () => {
      queryParams.startDate = ''
      queryParams.endDate = ''
      getList()
    }

    const changeCategory = (category) => {
      queryParams.category = category
      getList()
    }

    const openModalViewInvoice = (id) => {
      console.log(id)
    }

    const generatePdf = (id) => {
      console.log(id)
    }

    await getList()

    return {
      keyword,
      pagination,
      tableData,
      headers,
      BILLING_CATEGORY,
      clearDate,
      getList,
      categoryOptions,
      queryParams,
      openModalViewInvoice,
      generatePdf,
      changeCategory
    }
  }
}
</script>

<template lang="pug">
f-scrollbar-container(class="w-full h-full")
  div(class="ml-7.5 mt-7.5")
    global-breadcrumb-list(
      :breadcrumbList="breadcrumbList"
      @click:item="$router.push($event.path)"
    )
  div(class="w-full h-full flex justify-center")
    div(class="w-240")
      div(class="ml-5 mt-15.5")
        h3(class="text-h3 text-grey-900 pb-5 font-medium") {{ $t('DD0001') }}
        div(class="flex justify-between items-end")
          div(class="text-grey-900 text-body1 leading-1.6")
            p {{ $t('DD0079') }}
            p {{ $t('DD0080') }}
          f-tooltip-toggle(placement="bottom" :triggerText="$t('DD0081')")
            template(#slot:tooltip-toggle-content)
              i18n-t(
                keypath="DD0010"
                tag="div"
                class="pb-7.5 text-caption/1.3 text-grey-50"
                scope="global"
              )
                template(#DD0111)
                  span {{ $t('DD0111') }}
              img(src="@/assets/images/back_side.png")
            template(#slot:tooltip-toggle-link)
              div(
                class="flex items-end gap-x-1 text-cyan-200 cursor-pointer text-caption/1.3"
                @click="printBackSideLabel"
              ) {{ $t('DD0111') }}
                f-svg-icon(iconName="open_in_new" size="14")
            template(#slot:tooltip-toggle-button="{ collapseTooltipToggle }")
              f-button(size="sm" @click="collapseTooltipToggle") {{ $t('UU0026') }}
      div(class="mt-8")
        div(class="grid grid-cols-3 gap-7.5")
          div
            div(class="border border-grey-250 rounded-md")
              div(class="h-64 flex items-end justify-center")
                img(src="@/assets/images/upload_step1.png" class="w-60")
              div(class="flex min-h-20 bg-grey-100 rounded-b-md p-4")
                div(
                  class="mr-2 flex-shrink-0 bg-grey-0 text-grey-250 rounded-full w-6 h-6 flex items-center justify-center"
                ) 1
                div(class="text-grey-900 text-body1 font-bold leading-1.6") {{ $t('DD0082') }}
            div(class="text-grey-900 pl-5 pt-6")
              p(class="text-body2 font-bold leading-1.6 mb-1.5") {{ $t('DD0072') }}
              ul(class="text-caption leading-1.6")
                li 1. {{ $t('DD0073') }}
                li 2. {{ $t('DD0074') }}
                li 3. {{ $t('DD0075') }}
          div
            div(class="border border-grey-250 rounded-md")
              div(class="h-64 flex items-end justify-center")
                img(src="@/assets/images/upload_step2.png" class="w-60")
              div(class="flex min-h-20 bg-grey-100 rounded-b-md p-4")
                div(
                  class="mr-2 flex-shrink-0 bg-grey-0 text-grey-250 rounded-full w-6 h-6 flex items-center justify-center"
                ) 2
                div(class="text-grey-900 text-body1 font-bold leading-1.6") {{ $t('DD0083') }}
            div(class="pl-5 pt-6 font-bold leading-1.6 text-body2")
              p(class="text-grey-900 mb-1.5") {{ $t('DD0086') }}:
              p(class="text-primary-400") {{ uploadMaterialEmail }}
          div
            div(class="border border-grey-250 rounded-md")
              div(class="h-64 flex items-end justify-center")
                img(src="@/assets/images/upload_step3.png" class="w-60")
              div(class="flex min-h-20 bg-grey-100 rounded-b-md p-4")
                div(
                  class="mr-2 flex-shrink-0 bg-grey-0 text-grey-250 rounded-full w-6 h-6 flex items-center justify-center"
                ) 3
                div(class="text-grey-900 text-body1 font-bold leading-1.6")
                  div {{ $t('DD0084') }}
                  i18n-t(keypath="DD0085" tag="div" scope="global")
                    template(#RR0008)
                      span(
                        class="text-cyan-400 underline cursor-pointer"
                        @click="goToAssets"
                      ) {{ $t('RR0008') }}
        div(class="pt-26 pb-18")
          div(class="text-h6 font-bold text-grey-600 pb-5") {{ $t('DD0087') }}
          div(class="grid gap-3")
            div(
              v-for="option in alternativeUploadOptions"
              class="flex py-6 px-7.5 cursor-pointer border border-grey-250 rounded"
              :data-cy="option.testId"
              @click="option.action"
            )
              f-svg-icon(:iconName="option.icon" size="32" class="text-primary-400")
              div(class="grid gap-3 pl-7.5")
                div(class="text-body1 font-bold text-grey-900") {{ option.title }}
                div(class="text-caption text-grey-600") {{ option.content }}
</template>

<script setup>
import useNavigation from '@/composables/useNavigation'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { printBackSideLabel } from '@/utils/print'

const { t } = useI18n()
const store = useStore()
const { prefixPath, parsePath, goToAssets, goToAssetsMaterialCreate } =
  useNavigation()
const openModalUploadMaterialImage = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-smart-upload',
  })
}

const openModalMassUpload = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-mass-upload',
  })
}
const alternativeUploadOptions = [
  {
    icon: 'image_file',
    title: t('DD0088'),
    content: t('DD0089'),
    action: openModalUploadMaterialImage,
    testId: 'smart-upload',
  },
  {
    icon: 'add_box_outline',
    title: t('DD0090'),
    content: t('DD0091'),
    action: goToAssetsMaterialCreate,
    testId: 'manual-upload',
  },
  {
    icon: 'multiple_file',
    title: t('DD0092'),
    content: t('DD0093'),
    action: openModalMassUpload,
    testId: 'mass-upload',
  },
]

const routeLocation = computed(() => store.getters['helper/routeLocation'])
const breadcrumbList = computed(() => {
  return [
    {
      name: t('DD0044'),
      path: parsePath(`${prefixPath.value}/assets`),
    },
    {
      name: t('DD0045'),
      path: parsePath(`${prefixPath.value}/assets/upload`),
    },
  ]
})

const uploadMaterialEmail = computed(() => {
  return routeLocation.value === 'org'
    ? store.getters['organization/uploadMaterialEmail']
    : store.getters['group/uploadMaterialEmail']
})
</script>

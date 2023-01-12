<template lang="pug">
div(class="w-full pt-3")
  f-breadcrumb(
    :breadcrumbList="breadcrumbList"
    @click:item="$router.push($event.path)"
  )
  div(class="w-212.5 mx-auto pt-16.5")
    div(class="mb-16")
      div(class="flex mb-6 h-20.5")
        div(
          class="w-20.5 p-2 border border-grey-600/20 rounded-lg flex justify-center items-center flex-shrink-0"
        )
          img(:src="made2flow.logo" class="w-auto")
        div(class="flex flex-col justify-center ml-4.5")
          p(class="text-h4 font-bold text-grey-900 pb-3") {{ made2flow.projectName }}
          i18n-t(
            keypath="VV0004"
            scope="global"
            tag="div"
            class="text-caption leading-1.6 text-grey-600"
          )
            template(#providerName)
              a(
                href="https://www.made2flow.com/"
                target="_blank"
                class="text-cyan-500"
              ) {{ made2flow.providerName }}
      div(class="flex gap-2")
        f-label(
          v-for="(tag, index) in tagList"
          :active="indexOfActiveTag === index"
          @click="indexOfActiveTag = index"
        ) {{ tag }}
    div(
      v-if="tagList[indexOfActiveTag] === MADE2FLOW_TAG_LIST.INTRODUCTION.text"
    )
      div
        div(class="flex items-center")
          div(
            class="flex-shrink-0 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer"
            @click="prevSlide"
            style="box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15)"
          )
            f-svg-icon(iconName="keyboard_arrow_left" size="34" class="text-grey-600")
          carousel(ref="refCarousel")
            slide(
              v-for="(image, index) in made2flow.detail.slideImage"
              :key="index"
            )
              img(class="w-165 h-100" :src="image")
          div(
            class="flex-shrink-0 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer"
            @click="nextSlide"
            style="box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15)"
          )
            f-svg-icon(iconName="keyboard_arrow_right" size="34" class="text-grey-600")
        div(class="grid gap-x-3 grid-cols-3 w-fit mx-auto mt-4")
          div(
            v-for="(item, index) in 3"
            class="w-3 h-3 rounded-full"
            :class="[currentSlide === index ? 'bg-grey-900' : 'bg-grey-150']"
          )
      div(class="mt-10") 
        p(class="text-body1 text-grey-900 font-bold pb-4") {{ $t('RR0246') }}
        article(class="text-body2 leading-1.6 text-grey-900 pb-22.5")
          p {{ $t('M2F041') }}
          br
          p {{ $t('M2F042') }}
          br
          p {{ $t('M2F043') }}
          br
          p {{ $t('M2F044') }}
          br
          p {{ $t('M2F045') }}
          br
          p {{ $t('M2F046') }}
          br
          i18n-t(keypath="M2F047" scope="global" tag="p")
            template(#newline)
              br
          br
          p {{ $t('M2F048') }}
    div(
      v-else-if="tagList[indexOfActiveTag] === MADE2FLOW_TAG_LIST.METHODOLOGY.text"
      class="pb-19"
    )
      p(class="text-body2 text-grey-900 leading-1.6 pb-3") {{ $t('RR0235') }}
      img(src="@/assets/images/methodology_visual_1.png")
      p(class="text-body2 text-grey-900 leading-1.6 pt-8 pb-2") {{ $t('RR0236') }}
      img(src="@/assets/images/methodology_visual_2.png")
    div(
      v-else-if="tagList[indexOfActiveTag] === MADE2FLOW_TAG_LIST.FAQ.text"
      class="pb-19"
    )
      div(v-for="faq in faqList")
        div(class="rounded border border-grey-200 mb-2") 
          div(
            class="h-12 pl-7 pr-4 flex items-center justify-between text-grey-900 hover:bg-grey-100 cursor-pointer"
            :class="{ 'bg-grey-100': faq.isExpand }"
            @click="faq.isExpand = !faq.isExpand"
          )
            p(class="text-caption font-bold leading-1.6") {{ faq.title }}
            f-svg-icon(
              v-if="!faq.isExpand"
              iconName="keyboard_arrow_down"
              size="24"
            )
            f-svg-icon(v-else iconName="keyboard_arrow_up" size="24")
          div(
            v-if="faq.isExpand"
            class="border-t border-grey-200 py-6 px-7 text-body2 text-grey-900 leading-1.6"
          ) {{ faq.answer }}
    div(
      v-else-if="tagList[indexOfActiveTag] === MADE2FLOW_TAG_LIST.PLAN_AND_PRICE.text"
    )
      p(class="text-body2 text-grey-900 leading-1.6 pb-9") {{ $t('VV0023') }}
      img(:src="made2flow.detail.planAndPrice")
      div(class="mt-7.5 pb-7.5 flex justify-end")
        f-button(size="lg" type="primary" class="w-145.5" @click="goToAppointment") {{ $t('UU0115') }}
    value-added-service-made2flow-appointment(
      v-else-if="tagList[indexOfActiveTag] === MADE2FLOW_TAG_LIST.APPOINTMENT.text"
    )
</template>

<script setup>
import { ref, watch, computed, defineAsyncComponent } from 'vue'
import useNavigation from '@/composables/useNavigation'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { VALUE_ADDED_SERVICE_ID, useConstants } from '@/utils/constants'
import valueAddedServiceList from '@/components/billings/valueAddedServiceList.js'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
// https://ismail9k.github.io/vue3-carousel/

const ValueAddedServiceMade2flowAppointment = defineAsyncComponent(() =>
  import('@/components/billings/ValueAddedServiceMade2flowAppointment.vue')
)

const { t } = useI18n()
const route = useRoute()
const { prefixPath, parsePath } = useNavigation()
const { MADE2FLOW_TAG_LIST } = useConstants()
const serviceList = valueAddedServiceList()

const refCarousel = ref(null)
const currentSlide = computed(
  () => refCarousel.value?.data.currentSlide.value || 0
)

const made2flow = ref(
  serviceList.find((service) => service.id === VALUE_ADDED_SERVICE_ID.MADE2FLOW)
)
const faqList = ref(
  made2flow.value.detail.faqList.map((faq) => ({ ...faq, isExpand: false }))
)

const indexOfActiveTag = ref(0)
const tagListKeys = Object.keys(MADE2FLOW_TAG_LIST.value)
const tagList = computed(() =>
  tagListKeys.map((key) => MADE2FLOW_TAG_LIST.value[key].text)
)
const breadcrumbList = computed(() => {
  return [
    {
      name: t('VV0001'),
      path: parsePath(`${prefixPath.value}/billings/value-added-service`),
    },
    {
      name: made2flow.value.projectName,
      path: parsePath(
        `${prefixPath.value}/billings/value-added-service?service=${Number(
          route.query.service
        )}`
      ),
    },
  ]
})

const goToAppointment = () => {
  indexOfActiveTag.value = tagListKeys.findIndex(
    (key) =>
      MADE2FLOW_TAG_LIST.value[key].id ===
      MADE2FLOW_TAG_LIST.value.APPOINTMENT.id
  )
}

const prevSlide = () => {
  if (refCarousel.value) {
    refCarousel.value.prev()
  }
}

const nextSlide = () => {
  if (refCarousel.value) {
    refCarousel.value.next()
  }
}

watch(
  () => route.query.tagId,
  () => {
    if (route.query.tagId) {
      indexOfActiveTag.value = tagListKeys.findIndex(
        (key) => MADE2FLOW_TAG_LIST.value[key].id === Number(route.query.tagId)
      )
    }
  },
  {
    immediate: true,
  }
)
</script>

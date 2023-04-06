<template lang="pug">
carousel(
  ref="refCarousel"
  :itemsToShow="2"
  :itemsToScroll="2"
  snapAlign="start"
  :wrapAround="false"
  class="-mx-2.5 relative group/addons"
  v-model="currentSlide"
  :mouseDrag="false"
  :touchDrag="false"
)
  slide(
    v-for="showroom in showroomList"
    :key="showroom.title"
    class="px-2.5 group/card cursor-pointer"
    @click="goShowroom(showroom.showroomId)"
  )
    div(
      class="w-full h-80 relative text-left bg-center bg-cover rounded overflow-hidden"
      :style="{ backgroundImage: `url(${showroom.coverImg})` }"
    )
      div(
        class="invisible group-hover/card:visible absolute z-1 w-full h-full bg-grey-900/30"
      )
      h1(class="text-h1 font-bold text-grey-100 pt-4 pl-4.5") {{ showroom.title }}
      div(
        class="absolute z-2 h-36.5 box-border bottom-0 left-0 bg-grey-900/50 w-full py-4 px-4.5"
      )
        p(
          class="flex text-caption font-bold"
          :class="getStatusProps(showroom.status).color"
        )
          span {{ getStatusProps(showroom.status).text }} ．
          span {{ showroom.period }}
        h5(class="pt-1 text-h5 !leading-1.5 font-bold text-grey-0 line-clamp-1") {{ showroom.subtitle }}
        p(class="pb-1 text-body1 !leading-1.6 text-grey-0 line-clamp-1") {{ showroom.location }}
        p(
          class="flex items-start line-clamp-2 text-caption text-grey-200 !leading-1.6 !break-normal"
        ) {{ showroom.categoryList.join(', ') }}
  template(#addons="{ slidesCount }")
    template(v-if="slidesCount > 2")
      div(class="grid gap-x-3 grid-flow-col w-fit mx-auto pt-4")
        div(
          v-for="page in totalPage"
          class="w-3 h-3 rounded-full cursor-pointer"
          :class="[currentPage === page ? 'bg-grey-900' : 'bg-grey-150']"
          @click="slideTo(page)"
        )
      div(
        v-if="currentPage !== 1"
        class="invisible group-hover/addons:visible absolute top-1/2 left-0 bg-grey-0 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer shadow-4"
        @click="prevSlide"
      )
        f-svg-icon(
          iconName="keyboard_arrow_left"
          size="34"
          class="text-grey-600 hover:text-primary-400"
        )
      div(
        v-if="currentPage !== totalPage"
        class="invisible group-hover/addons:visible absolute top-1/2 right-0 bg-grey-0 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer shadow-4"
        @click="nextSlide"
      )
        f-svg-icon(
          iconName="keyboard_arrow_right"
          size="34"
          class="text-grey-600 hover:text-primary-400"
        )
</template>

<script setup>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { SHOWROOM_STATUS } from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'

const store = useStore()
const { t } = useI18n()

const { goShowroom } = useNavigation()

const getStatusProps = (status) => {
  let text
  let color
  switch (status) {
    case SHOWROOM_STATUS.CLOSE:
      text = t('II0062')
      color = 'text-grey-200'
      break
    case SHOWROOM_STATUS.COMING_SOON:
      text = t('II0061')
      color = 'text-yellow-0'
      break
    default:
      text = t('II0060')
      color = 'text-yellow-0'
  }

  return {
    text,
    color,
  }
}
const showroomList = computed(() => store.getters['showroom/showroomList'])
const refCarousel = ref(null)
const totalSlide = computed(() => showroomList.value.length)
const currentSlide = ref(0)
const currentPage = computed(() => Math.round(currentSlide.value / 2) + 1)
const totalPage = computed(() => Math.round(totalSlide.value / 2))

const prevSlide = () => {
  if (!refCarousel.value) {
    return
  }
  currentSlide.value = Math.max(currentSlide.value - 2, 0)
}

const nextSlide = () => {
  if (!refCarousel.value) {
    return
  }
  const isOdd = totalSlide.value % 2 !== 0

  currentSlide.value = Math.min(
    currentSlide.value + 2,
    isOdd ? totalSlide.value - 1 : totalSlide.value - 2
  )
}

const slideTo = (page) => {
  currentSlide.value = 2 * (page - 1)
}
</script>

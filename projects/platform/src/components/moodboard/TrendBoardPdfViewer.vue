<template lang="pug">
div(class="w-full flex flex-col border border-grey-150 rounded")
  div(
    v-if="hasPdfFile"
    ref="containerRef"
    class="w-full bg-grey-100 flex items-center justify-center"
  )
    canvas(ref="canvasRef")
  div(
    v-else
    class="w-full aspect-[908/540] bg-grey-100 flex flex-col items-center justify-center gap-y-3"
  )
    f-svg-icon(iconName="file" size="110" class="text-grey-300") 
    span(class="text-body1 text-grey-300 font-bold") {{ $t('RR0247') }}
  div(
    class="relative h-16 px-8 flex flex-row items-center justify-between border-t border-grey-150"
  )
    span(class="text-body-2 text-grey-900")
      span(v-if="hasPdfFile") {{ name }}
    div(
      class="absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row gap-x-5"
    )
      f-svg-icon(
        iconName="keyboard_arrow_left"
        size="24"
        :class="[currentPageIndex <= 1 ? 'text-grey-300' : 'text-grey-900 cursor-pointer']"
        @click="handlePrevClick"
      )
      span(class="text-body2 text-grey-900 font-bold flex items-center") {{ currentPageIndex }} / {{ pageCount }}
      f-svg-icon(
        iconName="keyboard_arrow_right"
        size="24"
        :class="[currentPageIndex === pageCount ? 'text-grey-300' : 'text-grey-900 cursor-pointer']"
        @click="handleNextClick"
      )
    div(class="flex flex-row gap-x-2")
      f-button(
        type="text"
        size="sm"
        prependIcon="download"
        :disabled="!hasPdfFile"
        @click="handleDownload"
      ) {{ $t('UU0059') }}
      f-button(
        type="text"
        size="sm"
        prependIcon="open_in_new"
        @click="handleOpenInNewWindow"
        :disabled="!hasPdfFile"
      ) {{ $t('DD0070') }}
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRaw, watch } from 'vue'
import { pdfjs } from '@/utils/pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { downloadDataURLFile } from '@frontier/lib'

/**
 * fixed display area width/height ratio from Figma mockup
 */
const CONTAINER_ASPECT_RATIO = 908 / 540

const props = defineProps<{
  src?: string
  name?: string
}>()

const hasPdfFile = computed(() => !!props.src)

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const pdfDoc = ref<PDFDocumentProxy | null>(null)
const currentPageIndex = ref<number>(1)
let pageRendering = false
let pageIndexPending: number | null = null

const pageCount = computed(() => {
  if (!pdfDoc.value) {
    return 0
  }

  return pdfDoc.value.numPages
})

const renderPage = async (pageIndex: number) => {
  pageRendering = true
  if (!pdfDoc.value) {
    pageRendering = false
    throw new Error('pdfDoc is null')
  }
  if (!canvasRef.value) {
    pageRendering = false
    throw new Error('canvasRef is null')
  }
  if (!containerRef.value) {
    throw new Error('containerRef is null')
  }

  const page = await toRaw(pdfDoc.value).getPage(pageIndex)
  const viewport = page.getViewport({ scale: 1 })

  const canvas = canvasRef.value
  const context = canvas.getContext('2d')
  if (!context) {
    pageRendering = false
    throw new Error('context is null')
  }

  const widthDisplayScale = containerRef.value.offsetWidth / viewport.width
  const heightDisplayScale = containerRef.value.offsetHeight / viewport.height
  const displayScale = Math.min(widthDisplayScale, heightDisplayScale)
  const canvasScale = displayScale * window.devicePixelRatio

  canvas.width = Math.floor(viewport.width * canvasScale)
  canvas.height = Math.floor(viewport.height * canvasScale)
  canvas.style.width = `${Math.floor(viewport.width * displayScale)}px`
  canvas.style.height = `${Math.floor(viewport.height * displayScale)}px`

  const transform =
    canvasScale !== 1 ? [canvasScale, 0, 0, canvasScale, 0, 0] : undefined

  const renderTask = page.render({
    canvasContext: context,
    viewport,
    transform,
  })

  await renderTask.promise
  pageRendering = false
  if (pageIndexPending !== null) {
    renderPage(pageIndexPending)
    pageIndexPending = null
  }
}

const init = async () => {
  if (!props.src) {
    currentPageIndex.value = 0
    return
  }

  if (!containerRef.value) {
    throw new Error('containerRef is null')
  }

  containerRef.value.style.height = `${
    containerRef.value.offsetWidth / CONTAINER_ASPECT_RATIO
  }px`

  const loadingTask = pdfjs.getDocument(props.src)
  const doc = await loadingTask.promise
  pdfDoc.value = doc
  renderPage(currentPageIndex.value)
}

const handlePrevClick = () => {
  if (currentPageIndex.value === 1) {
    return
  }
  currentPageIndex.value -= 1
}

const handleNextClick = () => {
  if (currentPageIndex.value === pageCount.value) {
    return
  }
  currentPageIndex.value += 1
}

const queueRenderPage = (pageIndex: number) => {
  if (pageRendering) {
    pageIndexPending = pageIndex
  } else {
    renderPage(pageIndex)
  }
}

const handleDownload = () => {
  if (!props.src) {
    throw new Error('src is null')
  }
  /**
   * workaround:
   *
   * <a> tag download attribute will not work for PDF file in latest chrome,
   * chrome will open a new window to view PDF file.
   * solution is convert PDF file url to objectURL to download PDF directly.
   *
   * ref:
   * 1. https://stackoverflow.com/questions/51861852/pdf-file-not-downloading-with-html5-download-attribute
   * 2. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download
   */
  downloadDataURLFile(props.src, props.name)
}

const handleOpenInNewWindow = () => {
  if (!props.src) {
    throw new Error('src is null')
  }

  window.open(props.src, '_blank')
}

watch(currentPageIndex, () => {
  if (!hasPdfFile.value) {
    return
  }

  queueRenderPage(currentPageIndex.value)
})

onMounted(init)
</script>

<style scoped></style>

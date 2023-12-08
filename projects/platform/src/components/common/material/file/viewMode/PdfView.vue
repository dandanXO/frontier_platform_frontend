<template lang="pug">
div(
  ref="containerRef"
  class="absolute left-1/2 -translate-x-1/2 w-160 h-160 overflow-scroll"
)
  div(class="absolute left-0 top-0")
</template>

<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue'
import { pdfjs } from '@/utils/pdf'
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer'
import 'pdfjs-dist/web/pdf_viewer.css'

const props = defineProps<{
  src: string
}>()

const containerRef = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  if (!containerRef.value) {
    return
  }

  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry')
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
  }

  const eventBus = new pdfjsViewer.EventBus()
  const pdfLinkService = new pdfjsViewer.PDFLinkService({ eventBus })
  const pdfFindController = new pdfjsViewer.PDFFindController({
    eventBus,
    linkService: pdfLinkService,
  })

  const pdfViewer = new pdfjsViewer.PDFViewer({
    container: toRaw(containerRef.value),
    eventBus,
    linkService: pdfLinkService,
    findController: pdfFindController,
  })

  const loadingTask = pdfjs.getDocument({ url: props.src })
  const pdfDocument = await loadingTask.promise

  pdfViewer.setDocument(pdfDocument)
  pdfLinkService.setDocument(pdfDocument, null)

  eventBus.on('pagesinit', () => {
    pdfViewer.currentScaleValue = 'page-width'
  })
})
</script>

<style scoped></style>

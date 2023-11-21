import * as pdfjs from 'pdfjs-dist'

const getPreviewUrl = async (src: string) => {
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    /**
     * pdfjs needs to specify workerSrc to load worker file
     * ref: https://github.com/mozilla/pdf.js/issues/10478
     */
    // @ts-ignore
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry')
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
  }

  const loadingTask = pdfjs.getDocument(src)
  const doc = await loadingTask.promise

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas not supported')
  }

  const page = await doc.getPage(1)
  const viewport = page.getViewport({ scale: 1 })
  await page.render({ canvasContext: ctx, viewport }).promise

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        return reject(new Error('blob undefined'))
      }

      const url = URL.createObjectURL(blob)
      resolve(url)
    })
  })
}

export { pdfjs, getPreviewUrl }

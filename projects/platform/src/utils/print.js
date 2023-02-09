import QRCode from 'qrcode'
// https://www.npmjs.com/package/qrcode
import domtoimage from 'dom-to-image'
import { jsPDF as JsPDF } from 'jspdf'
import store from '@/store'
import useMaterial from '@/composables/useMaterial'
import { SIDE_TYPE } from '@/utils/constants'
import i18n from '@/utils/i18n'
import imgPdfOutLine from '@/assets/images/pdf-outline.png'
import { computed } from 'vue'

const t = i18n.global.t
const org = computed(() => store?.getters['organization/organization'])
const logo = computed(() => store?.getters['organization/orgLogo'])

const LABEL_WIDTH = 452
const LABEL_HEIGHT = 226

const A4_WIDTH = 594
const A4_HEIGHT = 842

const formatMaterialList = (materialList) => {
  const list = []

  materialList.forEach((material) => {
    const { isDoubleSideMaterial, frontierNo, relationFrontierNo } = material
    if (isDoubleSideMaterial) {
      list.push({
        ...material,
        frontierNo,
        sideType: SIDE_TYPE.FACE,
      })
      list.push({
        ...material,
        frontierNo: relationFrontierNo,
        sideType: SIDE_TYPE.BACK,
      })
    } else {
      list.push(material)
    }
  })

  list.forEach((item) => {
    const { materialInfo } = useMaterial(item)
    item.materialWeight = materialInfo.weight.value
    item.materialYarnCount = materialInfo.yarn.value
    item.materialDensity = materialInfo.density.value
    item.materialWidth = materialInfo.width.value

    // 此處將「%」符號由半形改為全形，是因為某些字串組合如「100%BCI」會導致渲染錯誤
    Object.keys(item).forEach((key) => {
      if (typeof item[key] === 'string') {
        item[key] = item[key].split('%').join('％')
      }
    })
  })

  return list
}

const printPdf = async (dataUrls, config) => {
  await asyncForEach(dataUrls, async (el, index, arr) => {
    for (let i = 0; i < el.num; i++) {
      config.doc.addImage(
        el.dataUrl,
        'JPEG',
        0,
        -i * config.height,
        config.width,
        config.height * el.num
      )
      if (i !== el.num - 1) {
        config.doc.addPage()
      }
    }
    if (index !== arr.length - 1) {
      config.doc.addPage()
    }
  })

  config.doc.setProperties({ title: 'new Report' })
  window.open(config.doc.output('bloburl').toString())
}

const printA4Card = async (materialList) => {
  store.dispatch('helper/pushModalLoading')
  const list = formatMaterialList(materialList)
  const scale = 3
  const dataUrls = []
  const pdfTarget = document.createElement('div')
  pdfTarget.classList.add('w-0', 'h-0', 'overflow-hidden')
  const domGenerator = (material) => {
    pdfTarget.innerHTML = `
      <div class="relative flex flex-col justify-between items-center w-148.5 h-210.5 bg-grey-0 px-10 py-10">
        <div class="flex w-full">
          <img src="${
            logo.value
          }" class="mr-3.5 w-16 h-16 rounded-full flex-shrink-0" />
          <div class="w-full">
            <p class="text-body1 font-bold mb-3.5">${material.materialNo}</p>
            <div class="text-caption text-grey-900 grid gap-y-1">
              <div class="flex"><p class="whitespace-nowrap flex-shrink-0 line-clamp-2">${t(
                'RR0014'
              )}：</p><p class="flex-1 line-clamp-2">${
      material.description
    }</p></div>
              <div class="flex"><p class="whitespace-nowrap flex-shrink-0 line-clamp-2">${t(
                'RR0021'
              )}：</p><p class="flex-1 line-clamp-2">${
      material.content
    }</p></div>
              <div class="flex"><p class="whitespace-nowrap flex-shrink-0 line-clamp-2">${t(
                'RR0023'
              )}：</p><p class="flex-1 line-clamp-2">${
      material.materialYarnCount
    }</p></div>
              <div class="flex"><p class="whitespace-nowrap flex-shrink-0 line-clamp-1">${t(
                'RR0024'
              )}：</p><p class="flex-1 line-clamp-1">${
      material.materialDensity
    }</p></div>
              <div class="flex"><p class="whitespace-nowrap flex-shrink-0 line-clamp-1">${t(
                'RR0025'
              )}：</p><p class="flex-1 line-clamp-1">${
      material.pattern || ''
    }</p></div>
              <div class="flex"><p class="whitespace-nowrap flex-shrink-0 line-clamp-1">${t(
                'RR0026'
              )}：</p><p class="flex-1 line-clamp-1">${
      material.color || ''
    }</p></div>
              <div class="flex"><p class="whitespace-nowrap flex-shrink-0 line-clamp-1">${t(
                'RR0015'
              )}：</p><p class="flex-1 line-clamp-1">${
      material.materialWeight
    }</p></div>
              <div class="flex"><p class="whitespace-nowrap flex-shrink-0 line-clamp-1">${t(
                'RR0019'
              )}：</p><p class="flex-1 line-clamp-1">${
      material.materialWidth
    }</p></div>
              <div class="flex"><p class="whitespace-nowrap flex-shrink-0 line-clamp-2">${t(
                'RR0022'
              )}：</p><p class="flex-1 line-clamp-2">${
      material.finish
    }</p></div>
            </div>
          </div>
          <div class="flex flex-col flex-shrink-0 items-center text-grey-900">
            <span id="mark" class="whitespace-nowrap text-caption font-bold"></span>
            <div id="container" class="mt-2.5 mb-2"></div>
            <span class="whitespace-nowrap text-caption scale-90">${
              material.frontierNo
            }</span>
          </div>
        </div>
        <div class="text-grey-600 relative flex flex-col items-center justify-center w-full h-97 bg-cover" style="background-image: url(${imgPdfOutLine})">
          <span class="whitespace-nowrap text-caption mb-2.5">${
            material.sideType === SIDE_TYPE.FACE ? t('DD0046') : t('DD0047')
          }</span>
          <span class="whitespace-nowrap text-caption">${t('DD0050')}</span>
        </div>
        <div class="flex flex-col justify-start items-start w-full">
          <span class="mb-2 font-bold text-caption">${org.value.orgName}</span>
          <span class="text-caption">${org.value.address || ''}</span>
        </div>
      </div>
    `
    document.body.appendChild(pdfTarget)
    const mark = document.getElementById('mark')
    if (material.sideType === SIDE_TYPE.BACK) {
      mark.innerText = t('DD0051')
      mark.classList.add(
        'text-grey-0',
        'py-1.5',
        'px-2',
        'bg-grey-900',
        'rounded-sm'
      )
    } else {
      mark.innerText = t('DD0046')
    }
    QRCode.toCanvas(
      material.frontierNo,
      { width: 60, margin: 0 },
      (err, canvas) => {
        if (err) throw err
        const container = document.getElementById('container')
        container.appendChild(canvas)
      }
    )
  }
  await asyncForEach(list, async (el, index, arr) => {
    domGenerator(el)
    const dataUrl = await domtoimage.toJpeg(pdfTarget, {
      width: A4_WIDTH * scale,
      height: A4_HEIGHT * scale,
      style: {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left',
      },
    })
    dataUrls.push({
      dataUrl,
      num: pdfTarget.children.length,
    })
    pdfTarget.remove()
  })
  await printPdf(dataUrls, {
    width: 21,
    height: 29.7,
    doc: new JsPDF({ unit: 'cm', format: 'a4', orientation: 'p' }),
  })
  store.dispatch('helper/closeModalLoading')
}

const printGeneralLabel = async (materialList) => {
  store.dispatch('helper/pushModalLoading')

  const list = formatMaterialList(materialList)

  const scale = 3
  const dataUrls = []
  const pdfTarget = document.createElement('div')
  pdfTarget.classList.add('w-0', 'h-0', 'overflow-hidden')

  const domGenerator = (material) => {
    material[
      'materialYarnDensityWidth'
    ] = `${material.materialYarnCount} ${material.materialDensity} ${material.materialWidth}`
    const fields = [
      'description',
      'content',
      'materialYarnDensityWidth',
      'finish',
      'materialWeight',
    ]
    const getHtmlString = () => {
      return fields
        .filter((field) => material[field].trim().length !== 0)
        .map((field) => material[field] + '<br>')
        .join('')
    }

    if (material.sideType === SIDE_TYPE.FACE) {
      pdfTarget.innerHTML = `
        <div class="relative flex w-113 h-56.5 bg-grey-0 pr-4 py-3">
          <div class="absolute top-3 left-3.5">
            <img src="${logo.value}" class="w-5 h-5 rounded-full" />
          </div>
          <div class="flex justify-center w-full">
            <div class="flex flex-col items-center justify-center ml-16">
              <div id="container" class="mb-4"></div>
              <div class="whitespace-nowrap text-grey-900 text-body2 mb-2">${t(
                'DD0046'
              )}</div>
              <div class="whitespace-nowrap text-grey-600 text-body2">${
                material.frontierNo
              }</div>
            </div>
            <div class="flex-none border border-grey-250 mx-6 my-5"></div>
            <div class="flex flex-col justify-center text-grey-900 w-56">
              <p class="mb-2 font-bold text-body2">${material.materialNo}</p>
              <p class="text-body2 line-clamp-7 break-words leading-1.4">${getHtmlString()}</p>
            </div>
          </div>
        </div>
      `
    }

    if (material.sideType === SIDE_TYPE.BACK) {
      pdfTarget.innerHTML = `
        <div class="relative flex w-113 h-56.5 bg-grey-0 pr-4 py-3">
          <div class="absolute top-3 left-3.5">
            <img src="${logo.value}" class="w-5 h-5 rounded-full" />
          </div>
          <div class="flex justify-center w-full">
            <div class="flex flex-col items-center justify-center">
              <div class="whitespace-nowrap text-grey-900 font-bold text-body1">${
                material.materialNo
              }</div>
              <div id="container" class="mt-4 mb-4"></div>
              <div class="whitespace-nowrap text-grey-900 text-body2 mb-2">${t(
                'DD0051'
              )}</div>
              <div class="whitespace-nowrap text-grey-600 text-body2">${
                material.frontierNo
              }</div>
            </div>
          </div>
        </div>
      `
    }

    document.body.appendChild(pdfTarget)

    QRCode.toCanvas(
      material.frontierNo,
      { width: 100, margin: 0 },
      (err, canvas) => {
        if (err) throw err

        const container = document.getElementById('container')
        container.appendChild(canvas)
      }
    )
  }

  await asyncForEach(list, async (el, index, arr) => {
    domGenerator(el)
    const dataUrl = await domtoimage.toJpeg(pdfTarget, {
      width: LABEL_WIDTH * scale,
      height: LABEL_HEIGHT * scale,
      style: {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left',
      },
    })

    dataUrls.push({
      dataUrl,
      num: pdfTarget.children.length,
    })
    pdfTarget.remove()
  })

  const PDF_WIDTH = 8
  const PDF_HEIGHT = 4
  await printPdf(dataUrls, {
    width: PDF_WIDTH,
    height: PDF_HEIGHT,
    doc: new JsPDF({
      unit: 'cm',
      format: [PDF_HEIGHT, PDF_WIDTH],
      orientation: 'l',
    }),
  })

  store.dispatch('helper/closeModalLoading')
}

const printBackSideLabel = async () => {
  store.dispatch('helper/pushModalLoading')

  const pdfTarget = document.createElement('div')
  pdfTarget.classList.add('w-0', 'h-0', 'overflow-hidden')
  pdfTarget.innerHTML = `
    <div class="relative flex items-center w-113 h-56.5 bg-grey-0 px-8 py-8">
      <div id="container" class="mr-5.5"></div>
      <div class="flex flex-col">
        <span class="mb-2 text-grey-900 font-bold text-h5">${t('DD0051')}</span>
        <span class="text-body2 leading-1.5">${t('DD0052')}</span>
      </div>
      <div class="absolute bottom-2.5 right-2.5 text-grey-250 font-bold">${t(
        'DD0053'
      )}</div>
    </div>
  `

  document.body.appendChild(pdfTarget)

  QRCode.toCanvas(
    'Scan Back Side',
    { width: 100, margin: 0 },
    (err, canvas) => {
      if (err) throw err

      const container = document.getElementById('container')
      container.appendChild(canvas)
    }
  )

  const scale = 5
  const dataUrl = await domtoimage.toJpeg(pdfTarget, {
    width: LABEL_WIDTH * scale,
    height: LABEL_HEIGHT * scale,
    style: {
      transform: 'scale(' + scale + ')',
      transformOrigin: 'top left',
    },
  })
  const doc = new JsPDF({ unit: 'cm', format: [4, 8], orientation: 'l' })
  doc.addImage(dataUrl, 'JPEG', 0, 0, 8, 4)
  pdfTarget.remove()

  window.open(doc.output('bloburl').toString())
  store.dispatch('helper/closeModalLoading')
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

export { printA4Card, printBackSideLabel, printGeneralLabel }

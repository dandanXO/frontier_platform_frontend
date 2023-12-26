import QRCode from 'qrcode'
// https://www.npmjs.com/package/qrcode
import domtoimage from 'dom-to-image'
import { jsPDF as JsPDF } from 'jspdf'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import type { Organization, Material } from '@frontier/platform-web-sdk'
import { computed } from 'vue'
import materialInfoForDisplay from '@/utils/material/materialInfoForDisplay'
import { MaterialSideType } from '@frontier/platform-web-sdk'
import frontierLogo from '@/assets/images/frontier_logo.png'
import imgPdfOutLine from '@/assets/images/pdf_outline.png'
import { getMaterialMainSide } from '@/utils/material/getMaterialMainSide'

type DomGenerator = (item: {
  sideType: MaterialSideType
  material: Material
}) => Promise<HTMLDivElement>

const makePdf = async (pdf: JsPDF, imgDataUrlList: string[]) => {
  for (let i = 0; i < imgDataUrlList.length; i++) {
    pdf.addImage(
      imgDataUrlList[i],
      'JPEG',
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight()
    )
    if (i !== imgDataUrlList.length - 1) {
      pdf.addPage()
    }
  }

  pdf.setProperties({ title: 'New Report' })
  window.open(pdf.output('bloburl').toString())
}

const makeQrCode = async (
  key: string,
  containerHtmlId: string,
  width: number
) => {
  const qrCodeContainer = document.getElementById(containerHtmlId)!
  const qrcode = await QRCode.toCanvas(key, {
    width,
    margin: 0,
  })
  qrCodeContainer.appendChild(qrcode)
}

const getImageDataUrl = (node: Node, width: number, height: number) => {
  const scale = 5
  return domtoimage.toJpeg(node, {
    width: width * scale,
    height: height * scale,
    style: {
      transform: 'scale(' + scale + ')',
      transformOrigin: 'top left',
    },
  })
}

const generate = async (
  generator: DomGenerator,
  materialList: Material[],
  width: number,
  height: number,
  jsPDF: JsPDF
) => {
  const imgDataUrlList = []
  for (const material of materialList) {
    const { isDoubleSide, sideType } = material
    const sideList = []

    if (isDoubleSide) {
      sideList.push({
        sideType: MaterialSideType.FACE_SIDE,
        material,
      })
      sideList.push({
        sideType: MaterialSideType.BACK_SIDE,
        material,
      })
    } else {
      sideList.push({
        sideType: sideType as MaterialSideType,
        material,
      })
    }

    for (const side of sideList) {
      const pdfVirtualDom = await generator(side)
      const imgDataUrl = await getImageDataUrl(pdfVirtualDom, width, height)
      imgDataUrlList.push(imgDataUrl)
      pdfVirtualDom.remove()
    }
  }
  await makePdf(jsPDF, imgDataUrlList)
}

const usePrint = () => {
  const { t } = useI18n()
  const store = useStore()
  const org = computed<Organization>(
    () => store?.getters['organization/organization']
  )
  const logo = computed<string>(() => store?.getters['organization/orgLogo'])

  const printA4Swatch = async (materialList: Material[]) => {
    store.dispatch('helper/pushModalLoading')

    const domGenerator: DomGenerator = async (item) => {
      const { sideType, material } = item
      const {
        itemNo,
        seasonInfo,
        isComposite,
        faceSide,
        backSide,
        width,
        weight,
      } = material
      const mainSide = getMaterialMainSide(material)
      const {
        frontierNo,
        featureList,
        contentList,
        finishList,
        construction,
        materialType,
      } = mainSide

      const virtualDom = document.createElement('div')
      virtualDom.classList.add('w-0', 'h-0', 'overflow-hidden')
      virtualDom.innerHTML = `
        <div class="w-148.5 h-210.5 bg-grey-0 flex flex-col">
          <div class="flex-grow px-10 pt-10 flex items-start gap-x-3">
            <img src="${
              logo.value
            }" class="w-12.5 h-12.5 rounded flex-shrink-0" />
            <div class="flex-grow text-grey-900">
              <h6 class="w-full text-body1 font-bold line-clamp-1">${itemNo}</h6>
              <div id="info-container" class="pt-3 grid gap-y-2 text-caption2/1.3 text-grey-900">
                <p>${materialInfoForDisplay.seasonInfo(seasonInfo).value}
                  <br/>
                  <span class="line-clamp-1">${
                    materialInfoForDisplay.featureList(featureList).value
                  }</span>
                </p>
              </div>
            </div>
            <div class="flex flex-col items-center gap-y-2.5">
              <p class="text-caption2 text-grey-0 p-2 flex items-center rounded font-bold bg-grey-900 whitespace-nowrap">${
                sideType === MaterialSideType.FACE_SIDE
                  ? t('RR0312')
                  : t('DD0051')
              }</p>
              <div id="qr-code-container"></div>
              <p class="text-caption2 text-grey-900">${frontierNo}</p>
            </div>
          </div>
          <div class="relative px-10 pb-5 flex items-center justify-center">
            <img src="${imgPdfOutLine}" class="w-128.5 h-122.5 object-contain" />
            <div class="absolute whitespace-nowrap text-center text-caption text-grey-600">
              <p class="font-bold pb-2.5">${
                sideType === MaterialSideType.FACE_SIDE
                  ? t('DD0046')
                  : t('DD0047')
              }</p>
              <p>${t('MI0127')}</p>
            </div>
          </div>
          <div class="w-full h-13 bg-grey-50 px-10 pt-4 flex items-start justify-between">
            <div class="text-grey-900 text-caption whitespace-nowrap ">
              <p class="font-bold">${org.value.orgName}</p>
              <p>${org.value.address}</p>
            </div>
            <div class="flex items-center gap-x-2">
              <img src="${frontierLogo}" class="w-15 h-3" />
              <p class="text-caption2 whitespace-nowrap text-grey-900"> ${t(
                'MI0126'
              )}</p>
            </div>
          </div>
        </div>
      `
      document.body.appendChild(virtualDom)

      const infoContainer = document.getElementById('info-container')!
      const constructionList =
        materialInfoForDisplay.construction(materialType, construction ?? {})
          .value ?? []
      const infoList = [
        materialInfoForDisplay.materialType(isComposite, {
          face: faceSide?.materialType,
          back: backSide?.materialType,
        }),
        ...Object.values(constructionList).map((item) => ({
          name: item.name,
          value: String(item.value),
        })),
        materialInfoForDisplay.contentList(contentList),
        materialInfoForDisplay.width(width),
        materialInfoForDisplay.weight(weight),
        materialInfoForDisplay.finishList(finishList),
      ]

      infoList.forEach((item) => {
        const { name, value } = item
        const row = document.createElement('div')
        row.classList.add('w-full', 'flex', 'items-center')
        row.innerHTML = `
          <p class="font-bold whitespace-nowrap">${name}：</p>
          <p class="flex-grow line-clamp-1">${value}</p>
        `
        infoContainer.appendChild(row)
      })

      await makeQrCode(frontierNo, 'qr-code-container', 60)

      return virtualDom
    }

    const A4_WIDTH = 594
    const A4_HEIGHT = 842
    await generate(
      domGenerator,
      materialList,
      A4_WIDTH,
      A4_HEIGHT,
      new JsPDF({ unit: 'cm', format: 'a4', orientation: 'p' })
    )

    store.dispatch('helper/closeModalLoading')
  }

  const printLabel = async (materialList: Material[]) => {
    store.dispatch('helper/pushModalLoading')

    const domGenerator = async (item: {
      sideType: MaterialSideType
      material: Material
    }) => {
      const { sideType, material } = item
      const { itemNo, isComposite, faceSide, backSide, weight } = material
      const mainSide = getMaterialMainSide(material)
      const {
        frontierNo,
        descriptionList,
        contentList,
        finishList,
        construction,
        materialType,
      } = mainSide

      const virtualDom = document.createElement('div')
      virtualDom.classList.add('w-0', 'h-0', 'overflow-hidden')
      virtualDom.innerHTML = `
        <div class="w-56.5 h-[113px] p-1.5 bg-grey-0 flex items-start gap-x-2">
          <img src="${logo.value}" class="w-4 h-4 rounded flex-shrink-0" />
          <div class="pt-0.5 flex items-center">
            <div class="pt-3">
              <div id="qr-code-container"></div>
              <p class="text-[7px] pt-2 text-grey-900 text-center">${
                sideType === MaterialSideType.FACE_SIDE
                  ? t('DD0046')
                  : t('DD0047')
              }</p>
              <p class="text-[7px] text-grey-600 text-center">${frontierNo}</p>
            </div>
            <div class="w-px h-20.5 mx-3 bg-grey-250"></div>
            <div id="info-container" class="w-full text-grey-900 grid gap-y-[1px]">
              <p class="text-[8px] font-bold pb-[3px]">${itemNo}</p>
          </div>
        </div>
      `
      document.body.appendChild(virtualDom)
      await makeQrCode(frontierNo, 'qr-code-container', 50)

      const infoContainer = document.getElementById('info-container')!
      const constructionList =
        materialInfoForDisplay.construction(materialType, construction ?? {})
          .value ?? []
      const infoList = [
        materialInfoForDisplay.materialType(isComposite, {
          face: faceSide?.materialType,
          back: backSide?.materialType,
        }).value + descriptionList.map(({ name }) => name).join(', '),
        ...Object.values(constructionList).map((item) => String(item.value)),
        materialInfoForDisplay.contentList(contentList).value,
        materialInfoForDisplay.weight(weight).value,
        materialInfoForDisplay.finishList(finishList).value,
      ]

      infoList.forEach((value) => {
        const row = document.createElement('p')
        row.classList.add('line-clamp-1')
        row.innerHTML = `
          <p class="flex-grow text-[7px] line-clamp-1">${value}</p>
        `
        infoContainer.appendChild(row)
      })

      return virtualDom
    }
    const LABEL_WIDTH = 226
    const LABEL_HEIGHT = 113
    await generate(
      domGenerator,
      materialList,
      LABEL_WIDTH,
      LABEL_HEIGHT,
      new JsPDF({ unit: 'cm', format: [4, 8], orientation: 'l' })
    )

    store.dispatch('helper/closeModalLoading')
  }

  const printBackSideLabel = async () => {
    store.dispatch('helper/pushModalLoading')

    const LABEL_WIDTH = 452
    const LABEL_HEIGHT = 226
    const pdfVirtualDom = document.createElement('div')
    pdfVirtualDom.classList.add('w-0', 'h-0', 'overflow-hidden')
    pdfVirtualDom.innerHTML = `
    <div class="relative flex items-center bg-grey-0 px-8 py-8" style="width: ${LABEL_WIDTH}px; height: ${LABEL_HEIGHT}px">
      <div id="qr-code-container" class="mr-5.5"></div>
      <div class="flex flex-col">
        <span class="mb-2 text-grey-900 font-bold text-h5">${t('DD0051')}</span>
        <span class="text-body2 leading-1.5">${t('DD0052')}</span>
      </div>
      <div class="absolute bottom-2.5 right-2.5 text-grey-250 font-bold">${t(
        'DD0053'
      )}</div>
    </div>
  `
    document.body.appendChild(pdfVirtualDom)
    await makeQrCode('Scan Back Side', 'qr-code-container', 100)
    const imgDataUrl = await getImageDataUrl(
      pdfVirtualDom,
      LABEL_WIDTH,
      LABEL_HEIGHT
    )
    pdfVirtualDom.remove()
    await makePdf(new JsPDF({ unit: 'cm', format: [4, 8], orientation: 'l' }), [
      imgDataUrl,
    ])

    store.dispatch('helper/closeModalLoading')
  }

  return {
    printA4Swatch,
    printLabel,
    printBackSideLabel,
  }
}

export default usePrint

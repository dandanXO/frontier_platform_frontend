import QRCode from 'qrcode'
// https://www.npmjs.com/package/qrcode
import domtoimage from 'dom-to-image'
import { jsPDF as JsPDF } from 'jspdf'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import type {
  Organization,
  Material,
  MaterialFaceSide,
  MaterialBackSide,
} from '@frontier/platform-web-sdk'
import { computed } from 'vue'
import materialInfoForDisplay from '@/utils/material/materialInfoForDisplay'
import { MaterialSideType } from '@frontier/platform-web-sdk'
import frontierLogo from '@/assets/images/frontier_logo.png'
import imgPdfOutLine from '@/assets/images/pdf_outline.png'

const printPdf = async (pdf: JsPDF, imgDataUrlList: string[]) => {
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

const usePrint = () => {
  const { t } = useI18n()
  const store = useStore()
  const org = computed<Organization>(
    () => store?.getters['organization/organization']
  )
  const logo = computed<string>(() => store?.getters['organization/orgLogo'])

  const printA4Swatch = async (materialList: Material[]) => {
    store.dispatch('helper/pushModalLoading')

    const domGenerator = async (item: {
      sideType: MaterialSideType
      material: Material
    }) => {
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
      const mainSide: MaterialFaceSide | MaterialBackSide =
        sideType === MaterialSideType.FACE_SIDE ? faceSide! : backSide!
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
                  ? t('Scan Face Side')
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
              <p>${t('DD0050')}</p>
            </div>
          </div>
          <div class="w-full h-13 bg-grey-50 px-10 pt-4 flex items-center justify-between">
            <div class="flex items-center text-grey-900 text-caption whitespace-nowrap ">
              <p class="font-bold">${org.value.orgName}</p>
              <p>${
                org.value.address ? '&nbsp|&nbsp' + org.value.address : ''
              }</p>
            </div>
            <div class="flex items-center gap-x-2">
              <img src="${frontierLogo}" class="w-15 h-3" />
              <p class="text-caption2 text-grey-900"> by ${t('GG0004')}</p>
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

      const qrCodeContainer = document.getElementById('qr-code-container')!
      const qrcode = await QRCode.toCanvas(frontierNo, {
        width: 60,
        margin: 0,
      })
      qrCodeContainer.appendChild(qrcode)

      return virtualDom
    }
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
        const pdfVirtualDom = await domGenerator(side)
        const scale = 3
        const A4_WIDTH = 594
        const A4_HEIGHT = 842
        const imgDataUrl = await domtoimage.toJpeg(pdfVirtualDom, {
          width: A4_WIDTH * scale,
          height: A4_HEIGHT * scale,
          style: {
            transform: 'scale(' + scale + ')',
            transformOrigin: 'top left',
          },
        })
        imgDataUrlList.push(imgDataUrl)
        pdfVirtualDom.remove()
      }
    }
    await printPdf(
      new JsPDF({ unit: 'cm', format: 'a4', orientation: 'p' }),
      imgDataUrlList
    )
    store.dispatch('helper/closeModalLoading')
  }

  return {
    printA4Swatch,
  }
}

export default usePrint

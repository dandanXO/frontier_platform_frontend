import QRCode from 'qrcode'
// https://www.npmjs.com/package/qrcode
import domtoimage from 'dom-to-image'
import { jsPDF as JsPDF } from 'jspdf'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import type {
  Organization,
  Material,
  MaterialWovenConstruction,
  MaterialKnitConstruction,
  MaterialLeatherConstruction,
  MaterialNonWovenConstruction,
  MaterialTrimConstruction,
} from '@frontier/platform-web-sdk'
import { computed } from 'vue'
import materialInfoForDisplay from '@/utils/material/materialInfoForDisplay'
import { MaterialSideType } from '@frontier/platform-web-sdk'
import frontierLogo from '@/assets/images/frontier_logo.png'
import imgPdfOutLine from '@/assets/images/pdf_outline.png'
import water from '@/assets/images/water.png'
import co2 from '@/assets/images/co2.png'
import land from '@/assets/images/land.png'
import { getMaterialMainSide } from '@/utils/material/getMaterialMainSide'
import { MaterialType } from '@frontier/platform-web-sdk'
import { toYYYYMMDDFormat, toHHMMAFormat } from '@frontier/lib/src/utils/date'

type DomGenerator = (item: {
  sideType: MaterialSideType
  material: Material
}) => Promise<HTMLDivElement>

const emissionsIconMapper = { water, co2, land };
const emissionsTextCodeMapper = { water: 'RR0216', co2: 'RR0215', land: 'RR0218' };

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
  const canvasScale = 10
  const qrcode = await QRCode.toCanvas(
    `${import.meta.env.VITE_APP_TEXTILE_CLOUD_ENDPOINT}/${key}`,
    {
      width: width * canvasScale,
      margin: 0,
      errorCorrectionLevel: 'high',
    }
  )
  qrcode.style.width = `${width}px`
  qrcode.style.height = `${width}px`
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
  const orgId = computed<number>(() => store?.getters['organization/orgId'])
  const logo = computed<string>(() => store?.getters['organization/orgLogo'])

  const printA4Swatch = async (materialList: Material[]) => {
    store.dispatch('helper/pushModalLoading')

    const domGenerator: DomGenerator = async (item) => {
      const { sideType, material } = item
      const {
        itemNo,
        seasonInfo,
        isComposite,
        width,
        weight,
        weightForDisplay,
        weightDisplaySetting,
      } = material
      const mainSide = getMaterialMainSide(material)
      const {
        frontierNo,
        featureList,
        contentList,
        finishList,
        construction,
        materialType,
        descriptionList,
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
              <div id="info-container" class="pt-3 grid gap-y-1 text-caption2/1.3 text-grey-900">
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
              <p>${org.value.address ? org.value.address : ''}</p>
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

      if (
        materialInfoForDisplay.seasonInfo(seasonInfo).value !== '' ||
        materialInfoForDisplay.featureList(featureList).value !== ''
      ) {
        const div = document.createElement('div')

        if (materialInfoForDisplay.seasonInfo(seasonInfo).value !== '') {
          div.innerHTML += `
            <p class="line-clamp-1">
              ${materialInfoForDisplay.seasonInfo(seasonInfo).value}
            </p>
          `
        }

        if (materialInfoForDisplay.featureList(featureList).value !== '') {
          div.innerHTML += `
             <p class="line-clamp-1">${
               materialInfoForDisplay.featureList(featureList).value
             }</p>
          `
        }
        infoContainer.appendChild(div)
      }
      const constructionList =
        materialInfoForDisplay.construction(materialType, construction ?? {})
          .value ?? []
      const infoList = [
        materialInfoForDisplay.materialType(
          isComposite,
          materialType,
          descriptionList
        ),
        ...Object.values(constructionList).map((item) => ({
          name: item.name,
          value: String(item.value),
        })),
        materialInfoForDisplay.contentList(contentList),
        materialInfoForDisplay.width(width),
        materialInfoForDisplay.weight(
          weight,
          weightForDisplay,
          weightDisplaySetting
        ),
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

    const isCustomize = [1694, 6].includes(orgId.value);

    const domGenerator = async (item: {
      sideType: MaterialSideType
      material: Material
    }) => {
      const { sideType, material } = item
      const {
        itemNo,
        isComposite,
        width,
        weight,
        weightForDisplay,
        weightDisplaySetting,
      } = material
      const mainSide = getMaterialMainSide(material)
      const {
        frontierNo,
        descriptionList,
        contentList,
        finishList,
        construction,
        materialType,
        colorInfo,
      } = mainSide

      const normalLabel = (virtualDom: HTMLDivElement) => {
        virtualDom.innerHTML = `
          <div class="w-64 h-[133px] p-1.5 bg-grey-0 flex items-start gap-x-2">
            <img src="${logo.value}" class="w-4 h-4 rounded flex-shrink-0" />
            <div class="w-full pt-0.5 flex flex-start">
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
              <div id="info-container" class="w-40 text-grey-900">
                <p class="text-[8px] font-bold pb-0.5 break-words">${itemNo}</p>
              </div>
            </div>
          </div>
        `
      }
      const customizeLabel = (virtualDom: HTMLDivElement) => {
        virtualDom.innerHTML = `
        <div class="relative flex gap-x-3 w-56.5 h-[141px] bg-grey-0 pr-2 pl-4 py-4 box-content">
          <div class="flex flex-col items-center gap-y-2">
            <div class="w-8 h-8 rounded-full overflow-hidden">
              <img src="${logo.value}" class="w-full h-full" />
            </div>
            <div id="qr-code-container"></div>
            <div class="flex flex-col justify-center items-center">
              <div class="whitespace-nowrap text-grey-900 text-[7px]">${
                sideType === MaterialSideType.FACE_SIDE
                  ? t('DD0046')
                  : t('DD0047')
              }</div>
              <div class="whitespace-nowrap text-grey-600 text-[7px]">${frontierNo}</div>
            </div>
          </div>
          <div class="w-px h-[105px] bg-grey-250"></div>
          <div id="info-container" class="w-33 text-grey-900">
            <p class="text-[8px] font-bold pb-1 break-words">${itemNo}</p>
          </div>
        </div>
        `
      }

      const virtualDom = document.createElement('div')
      virtualDom.classList.add('w-0', 'h-0', 'overflow-hidden')
      if (isCustomize) {
        customizeLabel(virtualDom)
      } else {
        normalLabel(virtualDom)
      }
      document.body.appendChild(virtualDom)
      await makeQrCode(frontierNo, 'qr-code-container', isCustomize ? 42 : 50)

      const infoContainer = document.getElementById('info-container')!
      const infoList: string[] = [
        materialInfoForDisplay.materialType(
          isComposite,
          materialType,
          descriptionList
        ).value,
      ]

      switch (materialType) {
        case MaterialType.WOVEN: {
          const { warpDensity, weftDensity, warpYarnSize, weftYarnSize } =
            (construction as MaterialWovenConstruction) ?? {}

          if (warpDensity && weftDensity) {
            infoList.push(`${warpDensity} X ${weftDensity}`)
          } else if (warpDensity) {
            infoList.push(warpDensity)
          } else if (weftDensity) {
            infoList.push(weftDensity)
          }

          if (warpYarnSize && weftYarnSize) {
            infoList.push(`${warpYarnSize} X ${weftYarnSize}`)
          } else if (warpYarnSize) {
            infoList.push(warpYarnSize)
          } else if (weftYarnSize) {
            infoList.push(weftYarnSize)
          }

          infoList.push(materialInfoForDisplay.width(width).value)
          break
        }
        case MaterialType.KNIT: {
          const { machineType, yarnSize, walesPerInch, coursesPerInch } =
            (construction as MaterialKnitConstruction) ?? {}

          if (machineType) {
            infoList.push(machineType)
          }

          if (yarnSize) {
            infoList.push(yarnSize)
          }

          let str = ''

          if (walesPerInch) {
            str += `${walesPerInch}"`
          }

          if (coursesPerInch) {
            str += ` ${coursesPerInch}"`
          }

          str += ` ${materialInfoForDisplay.width(width).value}`
          infoList.push(str)
          break
        }
        case MaterialType.LEATHER: {
          const { grade, tannage, averageSkinPerMeterSquare, thicknessPerMm } =
            (construction as MaterialLeatherConstruction) ?? {}

          if (grade) {
            infoList.push(grade)
          }

          if (tannage) {
            infoList.push(tannage)
          }

          let str = ''

          if (averageSkinPerMeterSquare) {
            str += `${averageSkinPerMeterSquare} m²`
          }

          if (thicknessPerMm) {
            str += ` ${thicknessPerMm} mm`
          }

          str += ` ${materialInfoForDisplay.width(width).value}`
          infoList.push(str)

          break
        }
        case MaterialType.NON_WOVEN: {
          const { bondingMethod, thicknessPerMm } =
            (construction as MaterialNonWovenConstruction) ?? {}
          if (bondingMethod) {
            infoList.push(bondingMethod)
          }

          let str = ''

          if (thicknessPerMm) {
            str += `${thicknessPerMm} mm`
          }

          str += ` ${materialInfoForDisplay.width(width).value}`
          infoList.push(str)
          break
        }
        case MaterialType.TRIM: {
          const { outerDiameter, length, thickness, width } =
            (construction as MaterialTrimConstruction) ?? {}
          let str = ''

          if (outerDiameter) {
            str += `${outerDiameter} d`
          }
          if (length) {
            str += `${length} mm`
          }
          if (thickness) {
            str += `${thickness} mm`
          }
          if (width) {
            str += `${width} m`
          }

          infoList.push(str)
          break
        }
      }

      infoList.push(
        materialInfoForDisplay.contentList(contentList).value,
        materialInfoForDisplay.weight(
          weight,
          weightForDisplay,
          weightDisplaySetting
        ).value,
        materialInfoForDisplay.finishList(finishList).value
      )

      if (isCustomize && colorInfo.color) {
        infoList.push(colorInfo.color)
      }

      infoList.forEach((value) => {
        const row = document.createElement('p')
        row.classList.add(
          'pl-px',
          'text-[7px]',
          'break-words',
          'w-full',
          '!leading-1.6'
        )
        row.innerHTML = value
        infoContainer.appendChild(row)
      })

      if (orgId.value === 30) {
        const carbonEmissionsInfo = materialInfoForDisplay.carbonEmission(material.carbonEmission);
        let info = ``;
        Object.keys(carbonEmissionsInfo).forEach((infoKey) => {
          const carbonInfo = carbonEmissionsInfo[infoKey];
          if (carbonInfo && carbonInfo.value && carbonInfo.icon) {
            info += `
              <div class="flex flex-row justify-start w-full gap-x-1">
                <img src="${emissionsIconMapper[carbonInfo.icon]}" class="w-2 h-2" />
                <p class="text-[6px] w-full">${carbonInfo.value} ${t(emissionsTextCodeMapper[carbonInfo.icon])}</p>
              </div>
            `;
          }
        });
        if (info !== ``) {
          const row = document.createElement('div');
          row.classList.add('flex', 'flex-row', 'justify-start', 'w-full', 'gap-x-1');
          row.innerHTML = info;
          infoContainer.appendChild(row);  
        }

        if (material.carbonEmission && material.carbonEmission.lastUpdateTime) {
          const timestamp = `
            <div class="flex flex-row w-full gap-x-1">
              <p class="text-[6px] w-full">${t('BB0141', {date: toYYYYMMDDFormat(material.carbonEmission.lastUpdateTime), time: toHHMMAFormat(material.carbonEmission.lastUpdateTime)})}</p>
            </div>
          `;
          const rowTimestamp = document.createElement('div');
          rowTimestamp.classList.add('flex', 'flex-row')
          rowTimestamp.innerHTML = timestamp;
          infoContainer.appendChild(rowTimestamp);
        }
      }

      return virtualDom
    }
    const LABEL_WIDTH = 256
    const LABEL_HEIGHT = isCustomize ? 141 : 133
    await generate(
      domGenerator,
      materialList,
      LABEL_WIDTH,
      LABEL_HEIGHT,
      new JsPDF({
        unit: 'cm',
        format: [isCustomize ? 5 : 4, 8],
        orientation: 'l',
      })
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

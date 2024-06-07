import QRCode from 'qrcode'
// https://www.npmjs.com/package/qrcode
import domtoimage from 'dom-to-image'
import html2canvas from 'html2canvas'
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
import { getMaterialBySide } from '@/utils/material/getMaterialBySide'
import { MaterialType } from '@frontier/platform-web-sdk'
import { toYYYYMMDDFormat, toHHMMAFormat } from '@frontier/lib/src/utils/date'
import {
  type QrCodePrintLabelSetting,
  DefaultPrintLabelSetting,
} from '@/composables/useAssets'

type DomGenerator = (item: {
  sideType: MaterialSideType
  material: Material
}) => Promise<HTMLDivElement>

const emissionsIconMapper = { water, co2, land }
const emissionsTextCodeMapper = {
  water: 'RR0216',
  co2: 'RR0215',
  land: 'RR0218',
}
const emissionsSettingMapper = {
  water: 'isPrintWaterDepletion',
  co2: 'isPrintGHG',
  land: 'isPrintLandUse',
}

const makePdf = async (
  pdf: JsPDF,
  imgDataUrlList: (string | HTMLCanvasElement)[]
) => {
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
  // This method of opening is even safer.
  try {
    const blob = pdf.output('blob')
    window.open(URL.createObjectURL(blob))
  } catch (e) {
    console.error('in makePdf')
    throw e
  }
}

const makeQrCode = async (
  key: string,
  containerHtmlId: string,
  width: number,
  withURL: boolean = true,
  logoUrl = ''
) => {
  const qrCodeContainer = document.getElementById(containerHtmlId)!
  const logoImage = document.createElement('img')
  if (logoUrl) {
    logoImage.setAttribute('src', logoUrl)
    logoImage.classList.add('w-[18px]', 'h-[18px]', 'absolute')
    logoImage.style.top = '50%'
    logoImage.style.left = '50%'
    logoImage.style.transform = 'translateY(-50%) translateX(-50%)'
    qrCodeContainer.appendChild(logoImage)
  }
  const canvasScale = 10
  const qrCodeContent = withURL
    ? `${import.meta.env.VITE_APP_TEXTILE_CLOUD_ENDPOINT}/${key}`
    : key
  const qrcode = await QRCode.toCanvas(qrCodeContent, {
    width: width * canvasScale,
    margin: 0,
    errorCorrectionLevel: 'high',
  })
  qrcode.style.width = `${width}px`
  qrcode.style.height = `${width}px`
  // 防呆 保證裡面只有一個 canvas
  qrCodeContainer.innerHTML = ''
  qrCodeContainer.appendChild(qrcode)
  if (logoUrl) {
    qrCodeContainer.appendChild(logoImage)
  }
}

const getImageDataUrl = (
  node: Node,
  width: number,
  height: number,
  isA4Paper: boolean = false
) => {
  const scale = 4
  if (isA4Paper) {
    return domtoimage.toPng(node, {
      width: width * scale,
      height: height * scale,
      style: {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left',
      },
    })
  } else {
    document
      .getElementById('googleidentityservice_button_styles')
      ?.setAttribute('data-html2canvas-ignore', 'true')
    document
      .getElementById('svg-sprite-component-wrap')
      ?.setAttribute('data-html2canvas-ignore', 'true')
    return html2canvas(node as HTMLElement, {
      scale: scale,
      width: width,
      height: height,
      useCORS: true,
    }).then((canvas) => canvas)
  }
}

const generate = async (
  generator: DomGenerator,
  materialList: Material[],
  width: number,
  height: number,
  jsPDF: JsPDF,
  isA4Paper: boolean = false
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
      const imgDataUrl = await getImageDataUrl(
        pdfVirtualDom,
        width,
        height,
        isA4Paper
      )
      imgDataUrlList.push(imgDataUrl)
      pdfVirtualDom.remove()
    }
  }
  try {
    await makePdf(jsPDF, imgDataUrlList)
  } catch (e) {
    console.error('in generate')
    throw e
  }
}

const usePrint = () => {
  const { t } = useI18n()
  const store = useStore()
  const org = computed<Organization>(
    () => store?.getters['organization/organization']
  )
  const logo = computed<string>(() => store?.getters['organization/orgLogo'])
  const orgType = computed<any>(() => store?.getters['helper/routeLocation'])
  const group = computed(() => store.getters['group/group'])
  const isTexpertsRule = computed<boolean>(
    () => store.getters['permission/isTexpertsRule']
  )

  const printA4Swatch = async (materialList: Material[]) => {
    store.dispatch('helper/pushModalLoading')

    const domGenerator: DomGenerator = async (item) => {
      const { sideType, material } = item
      const {
        itemNo,
        isComposite,
        width,
        weight,
        weightForDisplay,
        weightDisplaySetting,
      } = material
      const currentSide = getMaterialBySide(material, sideType)
      const {
        frontierNo,
        featureList,
        contentList,
        finishList,
        construction,
        materialType,
        descriptionList,
      } = currentSide
      let addressStr = ''
      const isUseGroupAddress = orgType.value && orgType.value === 'group'
      if (isUseGroupAddress) {
        addressStr = group.value.address
      } else if (org.value.address) {
        addressStr = org.value.address
      }

      const virtualDom = document.createElement('div')
      virtualDom.classList.add('w-0', 'h-0', 'overflow-hidden')
      virtualDom.innerHTML = `
        <div class="w-148.5 h-210.5 bg-grey-0 flex flex-col">
          <div class="flex-grow px-10 pt-10 flex items-start gap-x-3">
            <img src="${
              logo.value
            }" class="w-12.5 h-12.5 rounded flex-shrink-0" />
            <div class="flex-grow text-grey-900">
              <h6 class="w-full text-body1 font-bold line-clamp-1">${
                itemNo ?? ''
              }</h6>
              <div id="info-container" class="pt-2 grid gap-y-1 !text-[8px] leading-[1.6] text-grey-900">
              </div>
            </div>
            <div class="flex flex-col items-center gap-y-2.5">
              <p class="text-caption2 text-grey-0 p-2 flex items-center rounded font-bold bg-grey-900 whitespace-nowrap">${
                sideType === MaterialSideType.FACE_SIDE
                  ? t('RR0312')
                  : t('DD0051')
              }</p>
              <div id="qr-code-container" class="relative"></div>
              <p class="text-caption2 text-grey-900">${frontierNo}</p>
            </div>
          </div>
          <div class="relative px-10 pb-2.5 flex items-center justify-center">
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
          <div class="w-full h-18 bg-grey-50 px-6 pt-4 flex items-start justify-between">
            <div class="w-2/3 text-wrap text-caption mr-5">
              <p class="font-bold text-[12px] text-grey-900">${
                org.value.orgName
              }</p>
              <p class="mt-1.5 text-[10px] break-all text-grey-600">${
                addressStr || ''
              }</p>
            </div>
            <div class="w-1/3 flex items-center gap-x-2">
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

      if (materialInfoForDisplay.featureList(featureList).value !== '') {
        const div = document.createElement('div')

        if (materialInfoForDisplay.featureList(featureList).value !== '') {
          div.innerHTML += `
             <p class="line-clamp-2">${
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
        {
          ...materialInfoForDisplay.materialType(
            isComposite,
            materialType,
            descriptionList
          ),
          isTwoLine: true,
        },
        ...Object.values(constructionList)
          .filter((item) => item.value !== null)
          .map((item) => ({
            name: item.name,
            value: String(item.value),
            isTwoLine: false,
          })),
        {
          ...materialInfoForDisplay.contentList(contentList),
          isTwoLine: true,
        },
        {
          ...materialInfoForDisplay.width(width),
          isTwoLine: false,
        },
        {
          ...materialInfoForDisplay.weight(
            weight,
            weightForDisplay,
            weightDisplaySetting
          ),
          isTwoLine: false,
        },
        {
          ...materialInfoForDisplay.finishList(finishList),
          isTwoLine: true,
        },
      ]

      infoList.forEach((item) => {
        const { name, value, isTwoLine } = item
        const row = document.createElement('div')
        row.classList.add('w-full', 'flex', 'items-start')
        row.innerHTML = `
          <p class="font-bold whitespace-nowrap">${name}：</p>
          <p class="flex-grow ${
            isTwoLine ? 'line-clamp-2' : 'line-clamp-1'
          }">${value}</p>
        `
        infoContainer.appendChild(row)
      })

      await makeQrCode(
        frontierNo,
        'qr-code-container',
        60,
        true,
        isTexpertsRule.value ? '' : logo.value
      )

      return virtualDom
    }

    const A4_WIDTH = 594
    const A4_HEIGHT = 842
    try {
      await generate(
        domGenerator,
        materialList,
        A4_WIDTH,
        A4_HEIGHT,
        new JsPDF({ unit: 'cm', format: 'a4', orientation: 'p' }),
        true
      )
    } catch (e) {
      console.error('in domGenerator')
      store.dispatch('helper/closeModalLoading')
    }

    store.dispatch('helper/closeModalLoading')
  }

  const getPrintLabelItems = (
    item: { sideType: MaterialSideType; material: Material },
    setting: QrCodePrintLabelSetting
  ): string[] => {
    const { sideType, material } = item
    const {
      isComposite,
      width,
      weight,
      weightForDisplay,
      weightDisplaySetting,
    } = material
    const currentSide = getMaterialBySide(material, sideType)
    const {
      descriptionList,
      contentList,
      finishList,
      construction,
      materialType,
      colorInfo,
      featureList,
      patternInfo,
    } = currentSide

    const infoList: string[] = [
      materialInfoForDisplay.materialTypeBySetting(
        isComposite,
        materialType,
        descriptionList,
        setting as QrCodePrintLabelSetting
      ).value,
    ]

    switch (materialType) {
      case MaterialType.WOVEN: {
        const { warpDensity, weftDensity, warpYarnSize, weftYarnSize } =
          (construction as MaterialWovenConstruction) ?? {}

        if (setting.wovenOptions.isPrintDensity) {
          if (warpDensity && weftDensity) {
            infoList.push(`${warpDensity} X ${weftDensity}`)
          } else if (warpDensity) {
            infoList.push(warpDensity)
          } else if (weftDensity) {
            infoList.push(weftDensity)
          }
        }

        if (setting.wovenOptions.isPrintYarnSize) {
          if (warpYarnSize && weftYarnSize) {
            infoList.push(`${warpYarnSize} X ${weftYarnSize}`)
          } else if (warpYarnSize) {
            infoList.push(warpYarnSize)
          } else if (weftYarnSize) {
            infoList.push(weftYarnSize)
          }
        }

        if (width && setting.materialInfoOptions.isPrintWidth) {
          infoList.push(materialInfoForDisplay.width(width).value)
        }

        break
      }
      case MaterialType.KNIT: {
        const { machineType, yarnSize, walesPerInch, coursesPerInch } =
          (construction as MaterialKnitConstruction) ?? {}

        if (machineType && setting.knitOptions.isPrintMachineType) {
          infoList.push(machineType)
        }

        if (yarnSize && setting.knitOptions.isPrintYarnSize) {
          infoList.push(yarnSize)
        }

        const str = []

        if (walesPerInch && setting.knitOptions.isPrintWales) {
          str.push(`${walesPerInch}"`)
        }

        if (coursesPerInch && setting.knitOptions.isPrintCourses) {
          str.push(`${coursesPerInch}"`)
        }

        if (width && setting.materialInfoOptions.isPrintWidth) {
          str.push(`${materialInfoForDisplay.width(width).value}`)
        }

        infoList.push(str.join(' '))
        break
      }
      case MaterialType.LEATHER: {
        const { grade, tannage, averageSkinPerMeterSquare, thicknessPerMm } =
          (construction as MaterialLeatherConstruction) ?? {}

        if (grade && setting.leatherOptions.isPrintGrade) {
          infoList.push(grade)
        }

        if (tannage && setting.leatherOptions.isPrintTannage) {
          infoList.push(tannage)
        }

        const str = []

        if (
          averageSkinPerMeterSquare &&
          setting.leatherOptions.isPrintAverageSkinHideSize
        ) {
          str.push(`${averageSkinPerMeterSquare} m²`)
        }

        if (thicknessPerMm && setting.leatherOptions.isPrintThickness) {
          str.push(`${thicknessPerMm} mm`)
        }

        if (width && setting.materialInfoOptions.isPrintWidth) {
          str.push(`${materialInfoForDisplay.width(width).value}`)
        }
        infoList.push(str.join(' '))
        break
      }
      case MaterialType.NON_WOVEN: {
        const { bondingMethod, thicknessPerMm } =
          (construction as MaterialNonWovenConstruction) ?? {}
        if (bondingMethod && setting.nonwovenOptions.isPrintBondingMethod) {
          infoList.push(bondingMethod)
        }

        const str = []

        if (thicknessPerMm && setting.nonwovenOptions.isPrintThickness) {
          str.push(`${thicknessPerMm} mm`)
        }

        if (width && setting.materialInfoOptions.isPrintWidth) {
          str.push(`${materialInfoForDisplay.width(width).value}`)
        }
        infoList.push(str.join(' '))
        break
      }
      case MaterialType.TRIM: {
        const { outerDiameter, length, thickness, width } =
          (construction as MaterialTrimConstruction) ?? {}
        const str = []

        if (outerDiameter && setting.trimOptions.isPrintTrimDiameter) {
          str.push(`${outerDiameter} d`)
        }
        if (length && setting.trimOptions.isPrintTrimLength) {
          str.push(`${length} mm`)
        }
        if (thickness && setting.trimOptions.isPrintTrimThickness) {
          str.push(`${thickness} mm`)
        }
        if (width && setting.trimOptions.isPrintTrimWidth) {
          str.push(`${width} m`)
        }

        infoList.push(str.join(' '))
        break
      }
    }

    if (featureList && setting.materialInfoOptions.isPrintFeature) {
      infoList.push(materialInfoForDisplay.featureList(featureList).value)
    }
    if (contentList && setting.materialInfoOptions.isPrintContent) {
      infoList.push(materialInfoForDisplay.contentList(contentList).value)
    }
    if (
      weight &&
      weightForDisplay &&
      weightDisplaySetting &&
      setting.materialInfoOptions.isPrintWeight
    ) {
      infoList.push(
        materialInfoForDisplay.weight(
          weight,
          weightForDisplay,
          weightDisplaySetting
        ).value
      )
    }
    if (finishList && setting.materialInfoOptions.isPrintFinish) {
      infoList.push(materialInfoForDisplay.finishList(finishList).value)
    }
    const colorPattern: string[] = []
    if (
      colorInfo &&
      colorInfo.color &&
      setting.materialInfoOptions.isPrintColor
    ) {
      colorPattern.push(colorInfo.color)
    }
    if (patternInfo && setting.materialInfoOptions.isPrintPattern) {
      colorPattern.push(patternInfo.pattern)
    }
    if (colorPattern.length > 0) {
      infoList.push(colorPattern.join(', '))
    }

    return infoList
  }

  const printLabel = async (
    materialList: Material[],
    setting: QrCodePrintLabelSetting = DefaultPrintLabelSetting
  ) => {
    store.dispatch('helper/pushModalLoading')

    const fontSizeIndex = () => {
      const value = setting.fontSize ? setting.fontSize : 5

      return value - 5
    }
    const fontSizeOptions = [
      'text-[8.5px]',
      'text-[9.5px]',
      'text-[10.5px]',
      'text-[11.5px]',
      'text-[12.5px]',
      'text-[13.5px]',
      'text-[14.5px]',
      'text-[15.5px]',
    ]
    const iconSizeOptions = [
      'w-[8.5px] h-[8.5px]',
      'w-[9.5px] h-[9.5px]',
      'w-[10.5px] h-[10.5px]',
      'w-[11.5px] h-[11.5px]',
      'w-[12.5px] h-[12.5px]',
      'w-[13.5px] h-[13.5px]',
      'w-[14.5px] h-[14.5px]',
      'w-[15.5px] h-[15.5px]',
    ]
    const infoSize = fontSizeOptions[fontSizeIndex()]
    const iconSize = iconSizeOptions[fontSizeIndex()]
    const infoContainerWidth = 'w-[195px]'

    const domGenerator = async (item: {
      sideType: MaterialSideType
      material: Material
    }) => {
      const { sideType, material } = item
      const { itemNo } = material
      const currentSide = getMaterialBySide(material, sideType)
      const { frontierNo } = currentSide

      const normalLabel = (virtualDom: HTMLDivElement) => {
        virtualDom.innerHTML = `
          <div class="w-[83px] h-full flex flex-col justify-between">
            <div class="w-full flex flex-row justify-center mt-2 mb-4">
              <div id="qr-code-container" class="relative"></div>
            </div>
            <div class="w-full flex flex-col items-center mb-[10px]">
              <p class="text-[10px] bold whitespace-nowrap">${
                sideType === MaterialSideType.FACE_SIDE
                  ? t('DD0046')
                  : t('DD0047')
              }</p>
              <p class="text-[10px] text-grey-600">${frontierNo}</p>
            </div>
          </div>

          <div class="w-px h-[150px] bg-grey-250 mx-2"></div>

          <div id="info-container" class="${infoContainerWidth} h-full max-h-full flex flex-col overflow-hidden">
            <p class="font-bold mb-2">${itemNo ?? ''}</p>
          </div>
        `
      }
      const customizeLabel = (virtualDom: HTMLDivElement) => {
        virtualDom.innerHTML = `
          <div class="w-[83px] h-full flex flex-col">
            <div class="w-full flex justify-center">
              <img src="${logo.value}" class="w-8 h-8 object-cover rounded" />
            </div>
            <div class="w-full flex flex-row justify-center mt-2 mb-4">
              <div id="qr-code-container" class="relative"></div>
            </div>
            <div class="w-full flex flex-col items-center">
              <p class="text-[10px] bold whitespace-nowrap">${
                sideType === MaterialSideType.FACE_SIDE
                  ? t('DD0046')
                  : t('DD0047')
              }</p>
              <p class="text-[10px] text-grey-600">${frontierNo}</p>
            </div>
          </div>

          <div class="w-px h-[150px] bg-grey-250 mx-2"></div>

          <div id="info-container" class="${infoContainerWidth} h-full max-h-full flex flex-col overflow-hidden">
            <p class="font-bold mb-2">${itemNo ?? ''}</p>
          </div>
        `
      }

      const virtualDom = document.createElement('div')
      virtualDom.classList.add(
        'w-[300px]',
        'h-[170px]',
        'bg-[#ffffff]',
        'px-2',
        'pt-2',
        'pb-1',
        'flex',
        'flex-row',
        'overflow-hidden',
        'relative',
        'top-[-9999px]'
      )
      if (isTexpertsRule.value) {
        customizeLabel(virtualDom)
      } else {
        normalLabel(virtualDom)
      }
      document.body.appendChild(virtualDom)
      const qrWidth = 62

      await makeQrCode(
        frontierNo,
        'qr-code-container',
        qrWidth,
        true,
        isTexpertsRule.value ? '' : logo.value
      )

      const infoContainer = document.getElementById('info-container')!
      const infoList: string[] = getPrintLabelItems(
        { sideType, material },
        setting
      )

      infoList.forEach((value) => {
        const divRow = document.createElement('div')
        divRow.classList.add('w-full', 'flex')
        const row = document.createElement('p')
        row.classList.add(infoSize)
        row.innerHTML = value
        divRow.appendChild(row)
        infoContainer.appendChild(divRow)
      })

      const carbonEmissionsInfo = materialInfoForDisplay.carbonEmission(
        material.carbonEmission
      )
      let info = ``
      Object.keys(carbonEmissionsInfo).forEach((infoKey) => {
        const carbonInfo = carbonEmissionsInfo[infoKey]
        const carbonEmissionSetting =
          setting?.ecoImpactorOptions[emissionsSettingMapper[infoKey]]
        if (
          carbonInfo &&
          carbonInfo.value &&
          carbonInfo.icon &&
          carbonEmissionSetting
        ) {
          info += `
            <div class="flex flex-row items-center">
              <img src="${
                emissionsIconMapper[carbonInfo.icon]
              }" class="${iconSize}" />
              <p class="${infoSize}">${carbonInfo.value} ${t(
            emissionsTextCodeMapper[carbonInfo.icon]
          )}</p>
            </div>
          `
        }
      })
      if (info !== ``) {
        const row = document.createElement('div')
        row.classList.add('flex', 'flex-row')
        row.innerHTML = info
        infoContainer.appendChild(row)
      }

      if (
        material.carbonEmission &&
        material.carbonEmission.lastUpdateTime &&
        setting.ecoImpactorOptions.isPrintCapturedTime
      ) {
        const row = document.createElement('div')
        row.classList.add('flex', 'flex-row')
        const timestamp = t('BB0141', {
          date: toYYYYMMDDFormat(material.carbonEmission.lastUpdateTime),
          time: toHHMMAFormat(material.carbonEmission.lastUpdateTime),
        })
        const rowTimestamp = document.createElement('p')
        rowTimestamp.classList.add(infoSize)
        rowTimestamp.innerHTML = timestamp
        row.appendChild(rowTimestamp)
        infoContainer.appendChild(row)
      }

      return virtualDom
    }
    const LABEL_WIDTH = 300
    const LABEL_HEIGHT = 170
    await generate(
      domGenerator,
      materialList,
      LABEL_WIDTH,
      LABEL_HEIGHT,
      new JsPDF({
        unit: 'px',
        format: [LABEL_WIDTH, LABEL_HEIGHT],
        orientation: 'l',
      })
    )
    store.dispatch('helper/closeModalLoading')
    return new Promise((res, rej) => {
      res('finish printLabel')
    })
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
    await makeQrCode(
      'Scan Back Side',
      'qr-code-container',
      100,
      false,
      logo.value
    )
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
    makeQrCode,
    getPrintLabelItems,
  }
}

export default usePrint

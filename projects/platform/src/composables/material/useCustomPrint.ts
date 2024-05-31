import QRCode from 'qrcode'
// https://www.npmjs.com/package/qrcode
import html2canvas from 'html2canvas'
import { jsPDF as JsPDF } from 'jspdf'
import { useStore } from 'vuex'
import type {
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
import { getMaterialBySide } from '@/utils/material/getMaterialBySide'
import { MaterialType } from '@frontier/platform-web-sdk'

type DomGenerator = (item: {
  sideType: MaterialSideType
  material: Material
}) => Promise<HTMLDivElement>

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
  logoImage.setAttribute('src', logoUrl)
  logoImage.classList.add('w-[18px]', 'h-[18px]', 'absolute')
  logoImage.style.top = '50%'
  logoImage.style.left = '50%'
  logoImage.style.transform = 'translateY(-50%) translateX(-50%)'
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
  qrCodeContainer.appendChild(logoImage)
}

const getImageDataUrl = (node: Node, width: number, height: number) => {
  const scale = 4
  document
    .getElementById('googleidentityservice_button_styles')
    ?.setAttribute('data-html2canvas-ignore', 'true')
  document
    .getElementById('svg-sprite-component-wrap')
    ?.setAttribute('data-html2canvas-ignore', 'true')
  return html2canvas(node as HTMLElement, {
    scale: scale,
    useCORS: true,
  }).then((canvas) => canvas)
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
  try {
    await makePdf(jsPDF, imgDataUrlList)
  } catch (e) {
    console.error('in generate')
    throw e
  }
}

const usePrint = () => {
  const store = useStore()
  const logo = computed<string>(() => store?.getters['organization/orgLogo'])

  const getCustomLabelTopItems = (
    sideType: MaterialSideType,
    material: Material
  ): { Composition: string; Construction: any; Finish: string } => {
    const { contentList, construction, materialType, finishList } =
      getMaterialBySide(material, sideType)
    const infoList = []
    const infoRow = []
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

        if (walesPerInch) {
          infoRow.push(`${walesPerInch}"`)
        }

        if (coursesPerInch) {
          infoRow.push(`${coursesPerInch}"`)
        }

        infoList.push(infoRow.join(' '))
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

        if (averageSkinPerMeterSquare) {
          infoRow.push(`${averageSkinPerMeterSquare} m²`)
        }
        if (thicknessPerMm) {
          infoRow.push(`${thicknessPerMm} mm`)
        }

        infoList.push(infoRow.join(' '))
        break
      }
      case MaterialType.NON_WOVEN: {
        const { bondingMethod, thicknessPerMm } =
          (construction as MaterialNonWovenConstruction) ?? {}
        if (bondingMethod) {
          infoList.push(bondingMethod)
        }
        if (thicknessPerMm) {
          infoList.push(`${thicknessPerMm} mm`)
        }

        break
      }
      case MaterialType.TRIM: {
        const { outerDiameter, length, thickness, width } =
          (construction as MaterialTrimConstruction) ?? {}

        if (outerDiameter) {
          infoRow.push(`${outerDiameter} d`)
        }
        if (length) {
          infoRow.push(`${length} mm`)
        }
        if (thickness) {
          infoRow.push(`${thickness} mm`)
        }
        if (width) {
          infoRow.push(`${width} m`)
        }

        infoList.push(infoRow.join(' '))
        break
      }
    }

    return {
      Composition: materialInfoForDisplay.contentList(contentList).value,
      Construction: infoList,
      Finish: materialInfoForDisplay.finishList(finishList).value,
    }
  }
  const getCustomLabelBottomItems = (
    sideType: MaterialSideType,
    material: Material
  ): { Width: string; Remark: string } => {
    const { width, weight, weightForDisplay, weightDisplaySetting } = material
    const currentSide = getMaterialBySide(material, sideType)
    const { featureList } = currentSide
    // Only show cuttable width
    const widthDisplayStr = materialInfoForDisplay.width(width, true).value
    // Need to add bold style on Weight title.
    const weightTitle = `<span class="font-bold ml-2"> Weight：</span>`
    const weightDisplayStr = materialInfoForDisplay.weight(
      weight,
      weightForDisplay,
      weightDisplaySetting,
      true
    ).value
    // Weight become part of value of width here.
    // Output Example: Width: 55" Weight: 188 g/m2
    return {
      Width: `${widthDisplayStr} ${weightTitle}${weightDisplayStr}`,
      Remark: materialInfoForDisplay.featureList(featureList).value,
    }
  }

  const printLabel = async (materialList: Material[]) => {
    store.dispatch('helper/pushModalLoading')
    const infoSize = 'text-[11px]'
    const domGenerator = async (item: {
      sideType: MaterialSideType
      material: Material
    }) => {
      const { sideType, material } = item
      const { itemNo } = material
      const { frontierNo } = getMaterialBySide(material, sideType)
      const customizeLabel = (virtualDom: HTMLDivElement) => {
        virtualDom.innerHTML = `
          <div class="w-full flex justify-center items-center h-[28px] max-h-[28px] text-[16px]">${itemNo}</div> 
          <div class="w-full flex justify-start items-start flex-col relative overflow-hidden" id="info-top-content"></div>
          <div class="w-full flex flex-row relative items-stretch justify-between overflow-hidden max-h-[50%] relative top-[-6px]" id="info-content-2">
            <div class="h-auto flex flex-col overflow-hidden " id="info-bottom-left-content"></div>
            <div class="bottom-0 right-0 flex items-end">
              <div id="qurcode-content" style="width:63px; height:63px;">
                <div id="qr-code-container" class="relative"></div>
              </div>
            </div>
          </div>
        `
      }

      const virtualDom = document.createElement('div')
      virtualDom.classList.add(
        'border',
        'w-[7cm]',
        'h-[6cm]',
        'bg-[#ffffff]',
        'px-2',
        'pt-0',
        'mt-0',
        'pb-2',
        'flex',
        'flex-col',
        'overflow-hidden',
        'items-start',
        'relative'
      )

      customizeLabel(virtualDom)

      document.body.appendChild(virtualDom)
      const qrWidth = 62
      await makeQrCode(
        frontierNo,
        'qr-code-container',
        qrWidth,
        true,
        logo.value
      )

      const infoTopConten = document.getElementById('info-top-content')!
      const infoBottomLeftContent = document.getElementById(
        'info-bottom-left-content'
      )!

      const infoTopList: any = getCustomLabelTopItems(sideType, material)
      for (const key in infoTopList) {
        const divRow = document.createElement('div')
        const divLeftCol = document.createElement('div')
        const divRightCol = document.createElement('div')
        // Add 6px margin bottom in last row to fix pdf cut half row issue.
        if (key === 'Finish') {
          divRow.style.marginBottom = '12px'
        }
        if (Array.isArray(infoTopList[key])) {
          infoTopList[key] = infoTopList[key].join(', ')
        }
        divRow.classList.add('w-full', 'flex', 'flex-row')
        const rowTitle = document.createElement('p')
        rowTitle.classList.add(infoSize, 'font-bold')
        rowTitle.innerHTML = `${key}： `
        divLeftCol.appendChild(rowTitle)

        const rowContent = document.createElement('p')
        rowContent.classList.add(infoSize)
        rowContent.innerHTML = `${infoTopList[key]}`
        divRightCol.appendChild(rowContent)

        divRow.appendChild(divLeftCol)
        divRow.appendChild(divRightCol)
        infoTopConten.appendChild(divRow)
      }

      const infoBottomList: any = getCustomLabelBottomItems(sideType, material)
      for (const key in infoBottomList) {
        const divRow = document.createElement('div')
        const divLeftCol = document.createElement('div')
        const divRightCol = document.createElement('div')
        // Add 6px margin bottom in last row to fix pdf cut half row issue.
        if (key === 'Remark') {
          divRow.style.marginBottom = '6px'
        }
        if (Array.isArray(infoBottomList[key])) {
          infoBottomList[key] = infoBottomList[key].join(', ')
        }
        divRow.classList.add('w-full', 'flex', 'flex-row')
        const rowTitle = document.createElement('p')
        rowTitle.classList.add(infoSize, 'font-bold')
        rowTitle.innerHTML = `${key}： `
        divLeftCol.appendChild(rowTitle)

        const rowContent = document.createElement('p')
        rowContent.classList.add(infoSize)
        rowContent.innerHTML = `${infoBottomList[key]}`
        divRightCol.appendChild(rowContent)

        divRow.appendChild(divLeftCol)
        divRow.appendChild(divRightCol)

        infoBottomLeftContent.appendChild(divRow)
      }

      return virtualDom
    }
    const LABEL_WIDTH = 210
    const LABEL_HEIGHT = 180
    await generate(
      domGenerator,
      materialList,
      LABEL_WIDTH,
      LABEL_HEIGHT,
      new JsPDF({
        unit: 'cm',
        format: [7, 6],
        // Orientation of the first page. Possible values are "portrait" or "landscape" (or shortcuts "p" or "l").
        orientation: 'l',
      })
    )
    store.dispatch('helper/closeModalLoading')
    return new Promise((res, _rej) => {
      res('finish printLabel')
    })
  }

  return {
    printLabel,
    makeQrCode,
    getCustomLabelTopItems,
    getCustomLabelBottomItems,
  }
}
export default usePrint

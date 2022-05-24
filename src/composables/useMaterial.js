import { COVER_MODE, SIDE_TYPE, WEIGHT_UNIT } from '@/utils/constants.js'
import { computed } from '@vue/runtime-core'
import { ref, reactive } from 'vue'
import i18n from '@/utils/i18n'
import store from '@/store'
import imgDefaultMaterial from '@/assets/images/default_material.png'

const t = i18n.global.t

export default function useMaterial (material) {
  const {
    isDoubleSideMaterial,
    sideType,
    coverMode,
    faceSideImg,
    backSideImg,
    coverImg,
    weightUnit,
    weightOz,
    weightGsm,
    weightGy,
    warpYarnCount,
    weftYarnCount,
    warpDensity,
    weftDensity,
    width,
    content,
    pattern,
    color,
    finish,
    totalInventoryQty,
    materialSeq,
    sampleCardsRemainingQty,
    sampleCardsLocation,
    hangersRemainingQty,
    hangersLocation,
    publicPrice,
    privatePrice,
    attachmentList,
    frontierNo,
    carbonEmission
  } = material

  const scanFaceSide = !!faceSideImg?.crop
  const scanBackSide = !!backSideImg?.crop

  const currentCoverImg = ref(imgDefaultMaterial)
  const neverScanBefore = ref(true)
  const statusIconName = ref('front')

  if (coverMode === COVER_MODE.FACE && scanFaceSide) {
    currentCoverImg.value = faceSideImg.crop
    neverScanBefore.value = false
  } else if (coverMode === COVER_MODE.BACK && scanBackSide) {
    currentCoverImg.value = backSideImg.crop
    neverScanBefore.value = false
  } else if (coverMode === COVER_MODE.SUP) {
    currentCoverImg.value = coverImg
    neverScanBefore.value = false
  }

  if (isDoubleSideMaterial) {
    if (scanFaceSide && scanBackSide) statusIconName.value = 'double'
    else if (scanFaceSide && !scanBackSide) statusIconName.value = 'double-front'
    else if (!scanFaceSide && scanBackSide) statusIconName.value = 'double-back'
    else if (!scanFaceSide && !scanBackSide) statusIconName.value = 'no-image-double'
  } else {
    if (sideType === SIDE_TYPE.FACE) statusIconName.value = scanFaceSide ? 'front' : 'no-image-front'
    else if (sideType === SIDE_TYPE.BACK) statusIconName.value = scanBackSide ? 'back' : 'no-image-back'
  }

  const imageList = computed(() => {
    const list = []
    const faceCrop = {
      src: faceSideImg.crop,
      text: [t('RR0075')]
    }
    const faceRuler = {
      src: faceSideImg.ruler,
      text: [t('RR0075'), `(${t('RR0080')})`]
    }
    const backCrop = {
      src: backSideImg.crop,
      text: [t('RR0078')]
    }
    const backRuler = {
      src: backSideImg.ruler,
      text: [t('RR0078'), `(${t('RR0080')})`]
    }

    if (isDoubleSideMaterial) {
      if (coverMode === COVER_MODE.SUP) {
        list.push({
          src: coverImg,
          text: [t('RR0081')]
        })
        list.push(faceCrop, faceRuler, backCrop, backRuler)
      } else if (coverMode === COVER_MODE.FACE) {
        faceCrop.text.push(`(${t('RR0081')})`)
        list.push(faceCrop, faceRuler, backCrop, backRuler)
      } else if (coverMode === COVER_MODE.BACK) {
        backCrop.text.push(`(${t('RR0081')})`)
        list.push(faceCrop, faceRuler, backCrop, backRuler)
      }
    } else {
      if (sideType === SIDE_TYPE.FACE) {
        if (coverMode === COVER_MODE.SUP) {
          list.push({
            src: coverImg,
            text: [t('RR0081')]
          })
        } else {
          faceCrop.text.push(`(${t('RR0081')})`)
        }
        list.push(faceCrop, faceRuler)
      } else if (sideType === SIDE_TYPE.BACK) {
        if (coverMode === COVER_MODE.SUP) {
          list.push({
            src: coverImg,
            text: [t('RR0081')]
          })
        } else {
          backCrop.text.push(`(${t('RR0081')})`)
        }
        list.push(backCrop, backRuler)
      }
    }

    return list
  })

  const defaultCoverImgIndex = computed(() => {
    if (isDoubleSideMaterial) {
      if (coverMode === COVER_MODE.FACE) {
        return 0
      } else if (coverMode === COVER_MODE.BACK) {
        return 2
      } else if (coverMode === COVER_MODE.SUP) {
        return 0
      }
    } else {
      return 0
    }
  })

  const getPriceInfo = (priceObj) => {
    const countryList = store?.getters['code/countryList']
    const {
      countryCode,
      currency,
      price,
      unit,
      minimumOrderQuantity,
      minimumOrderQuantityUnit,
      minimumContainerQuantity,
      minimumContainerQuantityUnit,
      productionLeadTime,
      sampleLeadTime
    } = priceObj

    return {
      coo: { name: t('RR0042'), value: countryList.find(country => country.countryCode === countryCode)?.name || '' },
      pricing: { name: t('RR0043'), value: (price && currency && unit) ? `${price} ${currency} / ${unit}` : '' },
      moq: { name: t('RR0047'), value: (minimumOrderQuantity && minimumOrderQuantityUnit) ? `${minimumOrderQuantity} / ${minimumOrderQuantityUnit}` : '' },
      mcq: { name: t('RR0048'), value: (minimumContainerQuantity && minimumContainerQuantityUnit) ? `${minimumContainerQuantity} / ${minimumContainerQuantityUnit}` : '' },
      productionLeadTime: { name: t('RR0049'), value: productionLeadTime ? t('RR0083', { number: productionLeadTime }) : '' },
      sampleLeadTime: { name: t('RR0051'), value: sampleLeadTime ? t('RR0083', { number: sampleLeadTime }) : '' }
    }
  }

  const getWeight = () => {
    const square = String.fromCodePoint(0xB2)
    let html = ''
    if (weightUnit === WEIGHT_UNIT.GSM.value) {
      html = weightGsm ? `${weightGsm} g/m${square}(${weightOz} oz/y${square})` : ''
    } else if (weightUnit === WEIGHT_UNIT.OZ.value) {
      html = weightOz ? `${weightOz} oz/y${square}(${weightGsm} g/m${square})` : ''
    }

    if (weightGy) {
      html += `(${weightGy} g/y)`
    }
    return html
  }

  const getYarn = () => {
    if (warpYarnCount?.length > 0 && weftYarnCount?.length > 0) {
      return `${warpYarnCount} X ${weftYarnCount}`
    } else if (warpYarnCount?.length > 0) {
      return warpYarnCount
    } else if (weftYarnCount?.length > 0) {
      return weftYarnCount
    } else {
      return ''
    }
  }

  const getDensity = () => {
    if (warpDensity?.length > 0 && weftDensity?.length > 0) {
      return `${warpDensity} X ${weftDensity}`
    } else if (warpDensity?.length > 0) {
      return warpDensity
    } else if (weftDensity?.length > 0) {
      return weftDensity
    } else {
      return ''
    }
  }

  const materialInfo = reactive({
    frontierNo: { name: t('RR0084'), value: frontierNo },
    content: { name: t('RR0021'), value: content },
    yarn: { name: t('RR0023'), value: getYarn() },
    density: { name: t('RR0024'), value: getDensity() },
    pattern: { name: t('RR0025'), value: pattern },
    color: { name: t('RR0026'), value: color },
    weight: { name: t('RR0015'), value: getWeight() },
    width: { name: t('RR0019'), value: width > 0 ? `${width}"` : '' },
    finish: { name: t('RR0022'), value: finish },
    totalInventoryQty: { name: t('RR0034'), value: (typeof totalInventoryQty === 'number' ? totalInventoryQty : 0) + ' Y' },
    materialSeq: { name: t('RR0030'), value: materialSeq ? `# ${materialSeq}` : '' },
    sampleCard: { name: `${t('RR0031')}/${t('RR0032')}`, value: (sampleCardsRemainingQty && sampleCardsLocation) ? `${sampleCardsRemainingQty} / ${sampleCardsLocation}` : '' },
    hangers: { name: `${t('RR0033')}/${t('RR0032')}`, value: (hangersRemainingQty && hangersLocation) ? `${hangersRemainingQty} / ${hangersLocation}` : '' },
    publicPrice: getPriceInfo(publicPrice),
    privatePrice: getPriceInfo(privatePrice)
  })

  const materialBasicInfo = computed(() => {
    return Object.fromEntries(
      Object.entries(materialInfo)
        .filter(([key]) => [
          'frontierNo',
          'content',
          'yarn',
          'density',
          'pattern',
          'color',
          'weight',
          'width',
          'finish'
        ].includes(key))
    )
  })
  const materialInventoryInfo = computed(() => {
    return Object.fromEntries(
      Object.entries(materialInfo)
        .filter(([key]) => [
          'materialSeq',
          'sampleCard',
          'hangers'
        ].includes(key))
    )
  })
  const materialPublicPriceInfo = computed(() => Object.values(materialInfo.publicPrice))
  const materialPrivatePriceInfo = computed(() => Object.values(materialInfo.privatePrice))

  const attachmentSortedList = computed(() => {
    const extensionOrder = {
      '.png': 7,
      '.jpg': 6,
      '.jpeg': 5,
      '.gif': 4,
      '.mov': 3,
      '.mp4': 3,
      '.pdf': 2,
      '.zip': 1
    }
    const list = JSON.parse(JSON.stringify(attachmentList))
    list.sort((a, b) => extensionOrder[b.extension] - extensionOrder[a.extension])
    return list
  })

  const carbonEmissionInfo = computed(() => {
    const extendField = (sourceProperty, icon, title, unitShort, unitLong, saveUnit) => {
      sourceProperty['icon'] = icon
      sourceProperty['title'] = title
      sourceProperty['unitShort'] = unitShort
      sourceProperty['unitLong'] = unitLong
      sourceProperty['saveUnit'] = saveUnit
    }
    const { co2, water, land, energy } = JSON.parse(JSON.stringify(carbonEmission))
    extendField(co2, 'co2', t('RR0221'), t('RR0215'), t('RR0225'), 'RR0230')
    extendField(water, 'water', t('RR0222'), t('RR0216'), t('RR0226'), 'RR0231')
    extendField(land, 'land', t('RR0223'), t('RR0217'), t('RR0227'), 'RR0232')
    extendField(energy, 'energy', t('RR0224'), t('RR0218'), t('RR0228'), 'RR0233')
    return { co2, water, land, energy }
  })

  return {
    currentCoverImg,
    neverScanBefore,
    statusIconName,
    imageList,
    defaultCoverImgIndex,
    materialInfo,
    materialBasicInfo,
    materialInventoryInfo,
    materialPublicPriceInfo,
    materialPrivatePriceInfo,
    attachmentSortedList,
    carbonEmissionInfo
  }
}

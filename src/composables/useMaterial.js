import { COVER_MODE, SIDE_TYPE, WEIGHT_UNIT } from '@/utils/constants.js'
import { computed } from '@vue/runtime-core'
import { ref, reactive } from 'vue'
import i18n from '@/utils/i18n'
import store from '@/store'

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
    frontierNo
  } = material

  const scanFaceSide = !!faceSideImg?.crop
  const scanBackSide = !!backSideImg?.crop

  const currentCoverImg = ref(require('@/assets/images/default_material.png'))
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
      text: [i18n.global.t('RR0075')]
    }
    const faceRuler = {
      src: faceSideImg.ruler,
      text: [i18n.global.t('RR0075'), `(${i18n.global.t('RR0080')})`]
    }
    const backCrop = {
      src: backSideImg.crop,
      text: [i18n.global.t('RR0078')]
    }
    const backRuler = {
      src: backSideImg.ruler,
      text: [i18n.global.t('RR0078'), `(${i18n.global.t('RR0080')})`]
    }

    if (isDoubleSideMaterial) {
      if (coverMode === COVER_MODE.SUP) {
        list.push({
          src: coverImg,
          text: [i18n.global.t('RR0081')]
        })
        list.push(faceCrop, faceRuler, backCrop, backRuler)
      } else if (coverMode === COVER_MODE.FACE) {
        faceCrop.text.push(`(${i18n.global.t('RR0081')})`)
        list.push(faceCrop, faceRuler, backCrop, backRuler)
      } else if (coverMode === COVER_MODE.BACK) {
        backCrop.text.push(`(${i18n.global.t('RR0081')})`)
        list.push(faceCrop, faceRuler, backCrop, backRuler)
      }
    } else {
      if (sideType === SIDE_TYPE.FACE) {
        if (coverMode === COVER_MODE.SUP) {
          list.push({
            src: coverImg,
            text: [i18n.global.t('RR0081')]
          })
        } else {
          faceCrop.text.push(`(${i18n.global.t('RR0081')})`)
        }
        list.push(faceCrop, faceRuler)
      } else if (sideType === SIDE_TYPE.BACK) {
        if (coverMode === COVER_MODE.SUP) {
          list.push({
            src: coverImg,
            text: [i18n.global.t('RR0081')]
          })
        } else {
          backCrop.text.push(`(${i18n.global.t('RR0081')})`)
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
        return 4
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
      coo: { name: i18n.global.t('RR0042'), value: countryList.find(country => country.countryCode === countryCode)?.name || '' },
      pricing: { name: i18n.global.t('RR0043'), value: (price && currency && unit) ? `${price} ${currency} / ${unit}` : '' },
      moq: { name: i18n.global.t('RR0047'), value: (minimumOrderQuantity && minimumOrderQuantityUnit) ? `${minimumOrderQuantity} / ${minimumOrderQuantityUnit}` : '' },
      mcq: { name: i18n.global.t('RR0048'), value: (minimumContainerQuantity && minimumContainerQuantityUnit) ? `${minimumContainerQuantity} / ${minimumContainerQuantityUnit}` : '' },
      productionLeadTime: { name: i18n.global.t('RR0049'), value: productionLeadTime ? i18n.global.t('RR0083', { number: productionLeadTime }) : '' },
      sampleLeadTime: { name: i18n.global.t('RR0051'), value: sampleLeadTime ? i18n.global.t('RR0083', { number: sampleLeadTime }) : '' }
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
    frontierNo: { name: i18n.global.t('RR0084'), value: frontierNo },
    content: { name: i18n.global.t('RR0021'), value: content },
    yarn: { name: i18n.global.t('RR0023'), value: getYarn() },
    density: { name: i18n.global.t('RR0024'), value: getDensity() },
    pattern: { name: i18n.global.t('RR0025'), value: pattern },
    color: { name: i18n.global.t('RR0026'), value: color },
    weight: { name: i18n.global.t('RR0015'), value: getWeight() },
    width: { name: i18n.global.t('RR0019'), value: width > 0 ? `${width}"` : '' },
    finish: { name: i18n.global.t('RR0022'), value: finish },
    totalInventoryQty: { name: i18n.global.t('RR0034'), value: (typeof totalInventoryQty === 'number' ? totalInventoryQty : 0) + ' Y' },
    materialSeq: { name: i18n.global.t('RR0030'), value: materialSeq ? `# ${materialSeq}` : '' },
    sampleCard: { name: `${i18n.global.t('RR0031')}/${i18n.global.t('RR0032')}`, value: (sampleCardsRemainingQty && sampleCardsLocation) ? `${sampleCardsRemainingQty} / ${sampleCardsLocation}` : '' },
    hangers: { name: `${i18n.global.t('RR0033')}/${i18n.global.t('RR0032')}`, value: (hangersRemainingQty && hangersLocation) ? `${hangersRemainingQty} / ${hangersLocation}` : '' },
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
    attachmentSortedList
  }
}

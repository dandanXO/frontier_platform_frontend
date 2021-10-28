import { useI18n } from 'vue-i18n'
import { WEIGHT_UNIT } from '@/utils/constants.js'
import { useStore } from 'vuex'

export default function useAssets (material) {
  const { t } = useI18n()
  const store = useStore()

  const weight = ({ weightUnit, weightOz, weightGsm }) => {
    if (weightUnit === WEIGHT_UNIT.GSM) return `${weightGsm} g/m^2`
    else if (weightUnit === WEIGHT_UNIT.OZ) return `${weightOz} oz/y^2`
    else return ''
  }

  const editMaterial = {
    icon: 'create',
    name: t('RR0054'),
    func: () => {
      store.dispatch('material/setMaterial', material)
      store.dispatch('helper/openFullScreen', {
        component: 'material-edit'
      })
    }
  }

  const carbonCopy = {
    name: t('RR0055'),
    func: () => { console.log('carbonCopy') }
  }

  const cloneTo = {
    name: t('RR0056'),
    func: () => { console.log('cloneTo') }
  }

  const addToWorkspace = {
    name: t('RR0057'),
    func: () => { console.log('addToWorkspace') }
  }

  const create3DMaterial = {
    name: t('RR0058'),
    func: () => { console.log('create3DMaterial') }
  }

  const downloadU3M = {
    icon: 'u3m',
    name: t('RR0059'),
    func: () => { console.log('downloadU3M') }
  }

  const exportExcel = {
    name: t('RR0060'),
    func: () => { console.log('exportExcel') }
  }

  const printQRCode = {
    name: t('RR0061'),
    func: () => { console.log('printQRCode') }
  }

  const printCard = {
    icon: 'print',
    name: t('RR0062'),
    func: () => { console.log('printCard') }
  }

  const mergeCard = {
    name: t('RR0072'),
    func: () => { console.log('mergeCard') }
  }

  const deleteMaterial = {
    name: t('RR0063'),
    func: () => { console.log('deleteMaterial') }
  }

  return {
    weight,
    editMaterial,
    carbonCopy,
    cloneTo,
    addToWorkspace,
    create3DMaterial,
    downloadU3M,
    exportExcel,
    printQRCode,
    printCard,
    mergeCard,
    deleteMaterial
  }
}

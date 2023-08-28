export * from '@frontier/constants'
import i18n from '@frontier/i18n'
import { computed } from 'vue'

export const COVER_MODE = {
  FACE: 1,
  BACK: 2,
  SUP: 3,
}

export enum U3M_STATUS {
  UNQUALIFIED = -1,
  INITIAL = 0,
  IN_QUEUE = 1,
  COMPLETED = 2,
  PROCESSING = 3,
  UNSUCCESSFUL = 99,
}

export enum U3M_PROVIDER {
  FRONTIER = 1,
  CUSTOMER = 2,
}

export enum U3M_DOWNLOAD_PROP {
  U3M = 'zipUrl',
  U3MA = 'u3maUrl',
  GLTF = 'gltfUrl',
}

export enum MODAL_TYPE {
  MODAL = 0,
  FULLSCREEN = 1,
  LOADING = 2,
  CONFIRM = 3,
  BEHAVIOR = 4,
}

export const SIDE_TYPE = {
  FACE: 1,
  BACK: 2,
}

export const useConstants = () => {
  const WEIGHT_UNIT = computed(() => ({
    GSM: {
      text: i18n.global.t('RR0016'),
      value: 1,
    },
    OZ: {
      text: i18n.global.t('RR0017'),
      value: 2,
    },
  }))

  return {
    WEIGHT_UNIT,
  }
}

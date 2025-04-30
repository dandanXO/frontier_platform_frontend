import { useLocalStorage } from '@vueuse/core'

export const accessToken = useLocalStorage<string | null>('accessToken', null)
export const refreshToken = useLocalStorage<string | null>('refreshToken', null)
export const perspectiveCropperToolTour = useLocalStorage<boolean | null>(
  'perspectiveCropperToolTour',
  null
)
export const haveReadU3mInstruction = useLocalStorage<string | null>(
  'haveReadU3mInstruction',
  null
)
export const hasShownWelcomeModal = useLocalStorage<boolean | null>(
  'hasShownWelcomeModal',
  null
)

export const hasShownConstructionTypeInfo = useLocalStorage<boolean>(
  'hasShownConstructionTypeInfo',
  false
)

export const resendTimeLs = useLocalStorage<number | null>('r_tm', null)

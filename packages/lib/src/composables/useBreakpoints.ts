import { useBreakpoints as useBasedBreakpoints } from '@vueuse/core'

const useBreakpoints = () => {
  const breakpoints = useBasedBreakpoints({
    md: 768,
    lg: 1200,
    tablet: 600,
    desktop: 905,
  })

  const isMobile = breakpoints.smaller('tablet')
  const isDesktop = breakpoints.greaterOrEqual('desktop')

  return {
    breakpoints,
    isMobile,
    isDesktop,
  }
}

export { useBreakpoints }

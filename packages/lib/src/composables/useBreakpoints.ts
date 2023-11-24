import { useBreakpoints as useBasedBreakpoints } from '@vueuse/core'

const useBreakpoints = () => {
  const breakpoints = useBasedBreakpoints({
    md: 768,
    lg: 1200,
    tablet: 600,
    desktop: 905,
  })

  const largerThenMd = breakpoints.greaterOrEqual('md')
  const largerThenLg = breakpoints.greaterOrEqual('lg')
  const isMobile = breakpoints.smaller('tablet')
  const isTablet = breakpoints.greaterOrEqual('tablet')
  const isDesktop = breakpoints.greaterOrEqual('desktop')

  return {
    breakpoints,
    largerThenMd,
    largerThenLg,
    isMobile,
    isTablet,
    isDesktop,
  }
}

export { useBreakpoints }

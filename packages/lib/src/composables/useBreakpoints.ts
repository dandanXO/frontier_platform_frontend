import { useBreakpoints as useBasedBreakpoints } from '@vueuse/core'

const useBreakpoints = () => {
  const breakpoints = useBasedBreakpoints({ md: 768, lg: 1200 })

  const largerThenMd = breakpoints.greaterOrEqual('md')
  const largerThenLg = breakpoints.greaterOrEqual('lg')

  return { breakpoints, largerThenMd, largerThenLg }
}

export { useBreakpoints }

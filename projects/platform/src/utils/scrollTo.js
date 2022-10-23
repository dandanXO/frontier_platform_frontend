export default function scrollTo (dataScrollTo) {
  const element = document.querySelector(`[data-scroll-to="${dataScrollTo}"]`)
  element.scrollIntoView({ behavior: 'smooth' })
}

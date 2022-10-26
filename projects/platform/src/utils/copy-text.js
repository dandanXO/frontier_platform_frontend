// https://stackoverflow.com/a/30810322

export default function copyTex(text) {
  if (!navigator.clipboard) {
    const textArea = document.createElement('textarea')
    textArea.value = text

    // Avoid scrolling to bottom
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    document.execCommand('copy')
    document.body.removeChild(textArea)

    return
  }
  // In safari it is not possible to copy text asynchronously, but it works in setTimeout
  setTimeout(() => {
    navigator.clipboard.writeText(text)
  }, 0)
}

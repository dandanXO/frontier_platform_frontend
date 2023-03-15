const image2Object = (url: string) => {
  return new Promise((resolve) => {
    const img = new Image()

    img.onload = () => {
      const { width, height, src } = img
      resolve({ width, height, src })
    }

    img.src = url
  })
}

export { image2Object }

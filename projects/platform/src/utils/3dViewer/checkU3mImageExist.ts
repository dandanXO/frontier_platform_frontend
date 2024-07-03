function checkImageExist(url: string) {
  return new Promise((res) => {
    const image = new Image()
    image.onload = function () {
      res(this?.width > 0)
    }
    image.onerror = function () {
      res(false)
    }
    image.src = url
  })
}

export function checkU3mImageExist(u3m: any): Promise<boolean> {
  return new Promise(async (res) => {
    const baseImageExist = u3m?.baseImgUrl
      ? await checkImageExist(u3m?.baseImgUrl)
      : false
    const dipsImageExist = u3m?.dispImgUrl
      ? await checkImageExist(u3m?.dispImgUrl)
      : false
    const roughImageExist = u3m?.roughImgUrl
      ? await checkImageExist(u3m?.roughImgUrl)
      : false
    const normalImageExist = u3m?.normalImgUrl
      ? await checkImageExist(u3m?.normalImgUrl)
      : false
    res(
      ![
        baseImageExist,
        dipsImageExist,
        roughImageExist,
        normalImageExist,
      ].every((boolean) => boolean)
    )
  })
}

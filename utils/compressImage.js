const dataURLtoBlob = (dataurl) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
const compressImage = (image, IWidth = 150, IHeight = undefined) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    canvas.width = 150
    canvas.height = 150
    img.src = image
    img.onload = () => {
      const imageWidth = img.width
      const imageHeight = img.height
      const height = imageHeight / imageWidth * IWidth
      canvas.width = IWidth
      canvas.height = IHeight || height
      ctx.drawImage(img, 0, 0, imageWidth, imageHeight, 0, 0, IWidth, height)
      const file = dataURLtoBlob(canvas.toDataURL('image/jpeg'))
      console.log(file)
      resolve(file)
    }
  })
}
export default compressImage

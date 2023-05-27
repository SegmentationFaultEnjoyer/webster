import { fabric } from 'fabric'

import type { UseShapes } from '@/types'
import { animateObjectAppearence } from '@/helpers'

export function useShapes(canvas: fabric.Canvas): UseShapes {
  const defaultShapePosition: fabric.IObjectOptions = {
    top: 100,
    left: 100,
  }

  const defaultShapeSizes: fabric.IObjectOptions = {
    width: 50,
    height: 50,
  }

  const defaultShapeColors: fabric.IObjectOptions = {
    fill: '#77f',
  }

  const addRectangle = (options?: fabric.IRectOptions) => {
    const rect = new fabric.Rect({
      ...defaultShapePosition,
      ...defaultShapeColors,
      ...defaultShapeSizes,
      ...(!options ? {} : options),
    })

    animateObjectAppearence(canvas, rect)
  }

  const addTriangle = (options?: fabric.ITriangleOptions) => {
    const triangle = new fabric.Triangle({
      ...defaultShapePosition,
      ...defaultShapeColors,
      ...defaultShapeSizes,
      ...(!options ? {} : options),
    })

    animateObjectAppearence(canvas, triangle)
  }

  const addCircle = (options?: fabric.ICircleOptions) => {
    const circle = new fabric.Circle({
      ...defaultShapeColors,
      ...defaultShapePosition,
      radius: 50,
      ...(!options ? {} : options),
    })

    animateObjectAppearence(canvas, circle)
  }

  const _calcImageScaleFactor = (
    image: HTMLImageElement,
    maxCanvasSize: number,
  ) => {
    if (image.width > maxCanvasSize || image.height > maxCanvasSize) {
      const scale = Math.min(
        maxCanvasSize / image.width,
        maxCanvasSize / image.height,
      )
      return scale
    }

    return 1
  }

  const addImage = async (image: File, options?: fabric.IImageOptions) => {
    const reader = new FileReader()

    const arrayBuffer = await image.arrayBuffer()
    const imageBlob = new Blob([new Uint8Array(arrayBuffer)], {
      type: image.type,
    })

    reader.readAsDataURL(imageBlob)

    reader.onload = event => {
      if (!event.target?.result) return

      const maxCanvasSize = Math.min(canvas.width!, canvas.height!) / 2

      const hmtlImage = new Image()
      hmtlImage.src = event.target.result as string

      hmtlImage.onload = () => {
        const scale = _calcImageScaleFactor(hmtlImage, maxCanvasSize)

        const fabricImage = new fabric.Image(hmtlImage, {
          ...defaultShapePosition,
          ...(!options ? {} : options),
        })

        animateObjectAppearence(canvas, fabricImage, 400, scale)
      }
    }
  }

  const isShape = (object: fabric.Object) => {
    return (
      object instanceof fabric.Circle ||
      object instanceof fabric.Rect ||
      object instanceof fabric.Triangle
    )
  }

  // pencil drawing - path, spray and circle - group
  const isDrawingObject = (object: fabric.Object) => {
    return object instanceof fabric.Path || object instanceof fabric.Group
  }

  return {
    addRectangle,
    addTriangle,
    addCircle,
    addImage,
    isShape,
    isDrawingObject,
  }
}

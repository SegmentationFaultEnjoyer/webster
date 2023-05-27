import { type Ref, watch, ref } from 'vue'
import { fabric } from 'fabric'
import { useElementSize } from '@vueuse/core'

import { getImageScaleFactor, adjustObjectsSize } from '@/helpers'
import type { CanvasRepresentation, UseImageEditor } from '@/types'

import {
  setDragListener,
  setDeleteObjectListener,
  setSelectionListeners,
  setCreationListener,
  setGuideLineIntersectionListener,
  setRightClickListener,
  setMoveObjectsListener,
  setCopyPasteListeners,
  setHistoryNavigationListener,
} from '@/listeners'

import {
  useText,
  useDrawing,
  useObjectMutations,
  useCanvasOperations,
  useShapes,
} from '@/composables'

export function useImageEditor(
  canvasRef: Ref<HTMLCanvasElement>,
  canvasContainerRef: Ref<HTMLElement>,
): UseImageEditor {
  // Defines the number of fraction digits to use when serializing object
  fabric.Object.NUM_FRACTION_DIGITS = 16

  const canvas = new fabric.Canvas(canvasRef.value, {
    width: canvasContainerRef.value.offsetWidth,
    height: canvasContainerRef.value.offsetHeight,
    stopContextMenu: true,
    fireRightClick: true,
  })

  const {
    addText,
    switchBoldness,
    switchItalic,
    changeFont,
    changeFontSize,
    addFrame,
    changeTextAlign,
    isText,
  } = useText(canvas)

  const {
    addRectangle,
    addTriangle,
    addCircle,
    addImage,
    isShape,
    isDrawingObject,
  } = useShapes(canvas)

  const { startDraw, stopDraw, modifyBrush } = useDrawing(canvas)
  const { setBackgroundColor, setColor, setStroke, bringToFront, sendToBack } =
    useObjectMutations(canvas)
  const {
    download,
    canvasToFormData,
    zoom,
    currentZoom,
    copyObjectToClipboard,
    pasteObjectFromClipboard,
    deleteObjects,
    initHistory,
    undo,
    redo,
    discardActiveObject,
    canvasToJson,
    loadFromJson,
    canvasToBase64,
  } = useCanvasOperations(canvas)

  const activeObject = ref<fabric.Object | null>(null)
  const contextMenuState = ref<{
    isShown: boolean
    target?: fabric.Object
  }>({
    isShown: false,
  })
  const guidelinesDisabled = ref(false)

  // should be invoked in component`s onBeforeUnmount lifecycle hook
  const unmountCleanUp = ref<(() => void) | null>(null)

  const imageConfig: fabric.IImageOptions = {
    centeredScaling: true,
    centeredRotation: true,
  }

  const { width: containerWidth, height: containerHeight } =
    useElementSize(canvasContainerRef)

  const setCanvasListeners = () => {
    const dragRestrictionRule = () => currentZoom.value === 1

    // listeners is attached to canvas
    setDragListener(canvas, dragRestrictionRule)
    setDeleteObjectListener(canvas)
    setSelectionListeners(canvas, activeObject)
    setCreationListener(canvas, activeObject)
    setGuideLineIntersectionListener(canvas, guidelinesDisabled)
    setRightClickListener(canvas, contextMenuState)

    // listeners is attached to Document and need to be removed after unmount
    const removeMoveListener = setMoveObjectsListener(canvas)
    const removeCopyPasteListener = setCopyPasteListeners(
      copyObjectToClipboard,
      pasteObjectFromClipboard,
    )
    const removeHistoryListener = setHistoryNavigationListener(undo, redo)

    const removeListeners = () => {
      removeCopyPasteListener()
      removeMoveListener()
      removeHistoryListener()
    }

    unmountCleanUp.value = removeListeners
  }

  const init = (
    imageUrl?: string,
    savedState?: CanvasRepresentation,
    customOptions?: fabric.IImageOptions,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      // wait until container inititalizes then invoking init of canvas
      const stopWatching = watch(containerWidth, async () => {
        if (!containerWidth.value) return

        stopWatching()

        try {
          // initializing canvas from given image
          if (imageUrl) {
            await setBackgroundImage(imageUrl, customOptions)
            adjustCanvasDimensions()
            // initializing canvas from saved state
          } else if (savedState) {
            // image needs to be loaded first or it will lead to artifacts
            await setBackgroundImage(
              savedState.backgroundImage.src,
              customOptions,
            )
            adjustCanvasDimensions()

            // prevent caching in chrome
            const state = savedState
            state.backgroundImage.src = state.backgroundImage.src + '?fuck'

            loadFromJson(state)
            setTimeout(() => {
              adjustCanvasDimensions()
            }, 300)
          }

          setCanvasListeners()

          setTimeout(() => {
            initHistory()
          }, 100)

          resolve()
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  const setBackgroundImage = async (
    imageUrl: string,
    customOptions?: fabric.IImageOptions,
  ) => {
    return new Promise((resolve, reject) => {
      try {
        const imagePath = imageUrl.startsWith('blob')
          ? imageUrl
          : imageUrl + '?fuck-you-cors-policy'

        fabric.Image.fromURL(
          imagePath,
          (image: fabric.Image) => {
            if (
              !image.width ||
              !image.height ||
              !canvas?.width ||
              !canvas?.height
            )
              reject(new Error('Failed to load image'))

            canvas.setBackgroundImage(
              image,
              () => {
                canvas.renderAll()
                resolve(image)
              },
              {
                ...imageConfig,
                ...(customOptions ? customOptions : {}),
              },
            )
          },
          {
            crossOrigin: 'anonymous',
          },
        )
      } catch (error) {
        reject(error)
      }
    })
  }

  const setGuildelinesState = (payload: boolean) => {
    guidelinesDisabled.value = payload
  }

  const adjustCanvasDimensions = () => {
    if (!canvas?.backgroundImage || !canvasContainerRef.value) return

    const backgroundImage = canvas.backgroundImage as fabric.Image

    if (!backgroundImage.width || !backgroundImage.height) return

    const scaleFactor = getImageScaleFactor(
      backgroundImage.width,
      backgroundImage.height,
      containerWidth.value,
      containerHeight.value,
    )

    const originalWidth = canvas.width
    const originalHeight = canvas.height

    backgroundImage.scale(scaleFactor)

    canvas.setDimensions({
      height: backgroundImage.height * scaleFactor,
      width: backgroundImage.width * scaleFactor,
    })

    backgroundImage.center()

    adjustObjectsSize(canvas, originalWidth!, originalHeight!)

    canvas.renderAll()
  }

  watch(
    () => [containerHeight.value, containerWidth.value],
    adjustCanvasDimensions,
  )

  return {
    canvas,
    activeObject,
    contextMenuState,
    init,
    setGuildelinesState,
    unmountCleanUp,

    addRectangle,
    addTriangle,
    addCircle,
    addImage,
    isShape,
    isDrawingObject,

    addText,
    addFrame,
    switchBoldness,
    switchItalic,
    changeFont,
    changeFontSize,
    changeTextAlign,
    isText,

    setColor,
    setBackgroundColor,
    setStroke,
    bringToFront,
    sendToBack,

    zoom,
    currentZoom,
    download,
    canvasToFormData,
    copyObjectToClipboard,
    pasteObjectFromClipboard,
    deleteObjects,
    discardActiveObject,
    initHistory,
    undo,
    redo,
    canvasToJson,
    loadFromJson,
    canvasToBase64,

    startDraw,
    stopDraw,
    modifyBrush,
  }
}

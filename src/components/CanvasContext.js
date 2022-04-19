import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react"

const CanvasContext = createContext()

export const CanvasProvider = (props) => {
  const canvasRef = useRef(null)
  const [ctx, setCtx] = useState({})

  const tmpCanvasRef = useRef(null)
  const [tmpCtx, setTmpCtx] = useState({})

  const [isMouseDown, setIsMouseDown] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  const [pointerPos, setPointerPos] = useState([])
  const [prevPointerPos, setPrevPointerPos] = useState([])

  const [tool, setTool] = useState("pencil")

  const [strokes, setStrokes] = useState([])
  const [dots, setDots] = useState([])
  const [lines, setLines] = useState([])

  const initCanvas = () => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.cursor = "crosshair"

    const context = canvas.getContext("2d")
    context.lineWidth = 6
    context.lineCap = "round"
    context.lineJoin = "round"
    setCtx(context)

    const tmpCanvas = tmpCanvasRef.current
    tmpCanvas.width = window.innerWidth
    tmpCanvas.height = window.innerHeight
    tmpCanvas.style.cursor = "crosshair"

    const tmpContext = tmpCanvas.getContext("2d")
    tmpContext.lineWidth = 6
    tmpContext.lineCap = "round"
    tmpContext.lineJoin = "round"
    setTmpCtx(tmpContext)
  }

  useEffect(() => {
    if (lines.length > 0) reDraw()
  }, [lines])

  const mouseDown = (e) => {
    setIsMouseDown(true)
    setPointerPos(getPos(e))
    setPrevPointerPos(getPos(e))
  }

  const mouseMove = (e) => {
    if (!isMouseDown) return

    setIsMoving(true)
    setPointerPos(getPos(e))
    if (tool === "pencil") {
      draw(prevPointerPos, pointerPos)
      setStrokes((strokes) => [...strokes, [prevPointerPos, pointerPos]])
    } else if (tool === "eraser") {
      erase()
    } else if (tool === "line") {
      clearTmpCanvas()
      drawLine()

      return
    }
    setPrevPointerPos(pointerPos)
  }

  const mouseUp = () => {
    if (!isMoving && isMouseDown) {
      if (tool === "pencil") {
        drawDot(pointerPos)
        setDots((dots) => [...dots, pointerPos])
      } else if (tool === "eraser") {
        erase()
      }
    }

    if (tool === "line") {
      setLines((lines) => [...lines, [prevPointerPos, pointerPos]])
      clearTmpCanvas()
    }
    stopDrawing()
  }

  const getPos = (e) => {
    const { offsetX, offsetY } = e.nativeEvent
    return [offsetX, offsetY]
  }

  const draw = (A, B) => {
    ctx.beginPath()
    ctx.moveTo(A[0], A[1])
    ctx.lineTo(B[0], B[1])
    ctx.stroke()
  }

  const reDraw = () => {
    const canvas = canvasRef.current
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    strokes.forEach((stroke) => draw(stroke[0], stroke[1]))
    dots.forEach((dot) => drawDot(dot))
    lines.forEach((line) => {
      draw(line[0], line[1])
    })
  }

  const drawDot = (center) => {
    ctx.beginPath()
    ctx.arc(center[0], center[1], ctx.lineWidth / 2, 0, 2 * Math.PI)
    ctx.fill()
  }

  const drawLine = () => {
    tmpCtx.beginPath()
    tmpCtx.moveTo(prevPointerPos[0], prevPointerPos[1])
    tmpCtx.lineTo(pointerPos[0], pointerPos[1])
    tmpCtx.stroke()
  }

  const erase = () => {
    const squareX = pointerPos[0] - 15
    const squareY = pointerPos[1] - 15
    ctx.clearRect(squareX, squareY, 30, 30)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setStrokes([])
    setDots([])
    setLines([])
  }

  const clearTmpCanvas = () => {
    const tmpCanvas = tmpCanvasRef.current
    tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height)
  }

  const stopDrawing = () => {
    setIsMouseDown(false)
    setIsMoving(false)
  }

  const resumeDrawing = (e) => {
    if (e.nativeEvent.buttons === 1) {
      mouseDown(e)
    }
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        mouseDown,
        mouseMove,
        mouseUp,
        stopDrawing,
        resumeDrawing,
        initCanvas,
        setTool,
        clearCanvas,
        reDraw,
        tmpCanvasRef,
      }}
    >
      {props.children}
    </CanvasContext.Provider>
  )
}

export const useCanvasContext = () => useContext(CanvasContext)

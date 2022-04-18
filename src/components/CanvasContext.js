import React, { useRef, useState, useContext, createContext } from "react"

const CanvasContext = createContext()

export const CanvasProvider = (props) => {
  const canvasRef = useRef(null)
  const [ctx, setCtx] = useState({})

  const [isMouseDown, setIsMouseDown] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  const [pointerPos, setPointerPos] = useState([])
  const [prevPointerPos, setPrevPointerPos] = useState([])

  const [tool, setTool] = useState("pencil")

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
  }

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
      draw()
    } else if (tool === "eraser") {
      erase()
    }
    setPrevPointerPos(pointerPos)
  }

  const mouseUp = () => {
    if (!isMoving && isMouseDown) {
      if (tool === "pencil") {
        drawDot()
      } else if (tool === "eraser") {
        erase()
      }
    }

    stopDrawing()
  }

  const getPos = (e) => {
    const { offsetX, offsetY } = e.nativeEvent
    return [offsetX, offsetY]
  }

  const draw = () => {
    ctx.beginPath()
    ctx.moveTo(prevPointerPos[0], prevPointerPos[1])
    ctx.lineTo(pointerPos[0], pointerPos[1])
    ctx.stroke()
  }

  const erase = () => {
    const squareX = pointerPos[0] - 15
    const squareY = pointerPos[1] - 15
    ctx.clearRect(squareX, squareY, 30, 30)
  }

  const drawDot = () => {
    ctx.beginPath()
    ctx.arc(pointerPos[0], pointerPos[1], ctx.lineWidth / 2, 0, 2 * Math.PI)
    ctx.fill()
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
      }}
    >
      {props.children}
    </CanvasContext.Provider>
  )
}

export const useCanvasContext = () => useContext(CanvasContext)

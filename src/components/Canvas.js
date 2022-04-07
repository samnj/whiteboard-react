import React, { useRef, useEffect, useState } from "react"

const Canvas = () => {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  const [isMouseDown, setIsMouseDown] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  const [pointerPos, setPointerPos] = useState([])
  const [prevPointerPos, setPrevPointerPos] = useState([])

  const mouseDown = (e) => {
    setIsMouseDown(true)
    setPointerPos(getPos(e))
    setPrevPointerPos(getPos(e))
  }

  const mouseMove = (e) => {
    if (!isMouseDown) return

    setIsMoving(true)
    setPointerPos(getPos(e))
    draw(prevPointerPos, pointerPos)
    setPrevPointerPos(pointerPos)
  }

  const mouseUp = () => {
    if (!isMoving) {
      drawDot(pointerPos[0], pointerPos[1])
    }
    setIsMouseDown(false)
    setIsMoving(false)
  }

  const initCanvas = () => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.cursor = "crosshair"

    const context = canvas.getContext("2d")
    context.lineWidth = 6
    context.lineCap = "round"
    context.lineJoin = "round"
    contextRef.current = context
  }

  const getPos = (e) => {
    const { offsetX, offsetY } = e.nativeEvent
    return [offsetX, offsetY]
  }

  const draw = (startingPoint, endingPoint) => {
    contextRef.current.beginPath()
    contextRef.current.moveTo(startingPoint[0], startingPoint[1])
    contextRef.current.lineTo(endingPoint[0], endingPoint[1])
    contextRef.current.stroke()
  }

  const drawDot = (centerX, centerY) => {
    contextRef.current.beginPath()
    contextRef.current.arc(
      centerX,
      centerY,
      contextRef.current.lineWidth / 2,
      0,
      2 * Math.PI
    )
    contextRef.current.fill()
  }

  useEffect(() => {
    initCanvas()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
    />
  )
}

export default Canvas

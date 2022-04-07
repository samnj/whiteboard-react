import React, { useRef, useEffect, useState } from "react"

const Canvas = () => {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [isMouseDown, setIsMouseDown] = useState(false)

  const pointerPos = {}
  const prevPointerPos = {}

  const mouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent
    pointerPos.x = offsetX
    pointerPos.y = offsetY
    prevPointerPos.x = offsetX
    prevPointerPos.y = offsetY
    setIsMouseDown(true)
  }

  const mouseMove = (e) => {
    if (!isMouseDown) return

    const { offsetX, offsetY } = e.nativeEvent
    pointerPos.x = offsetX
    pointerPos.y = offsetY
    draw(prevPointerPos, pointerPos)
    prevPointerPos.x = pointerPos.x
    prevPointerPos.y = pointerPos.y
  }

  const mouseUp = () => {
    setIsMouseDown(false)
  }

  const initCanvas = () => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    canvas.style.cursor = "crosshair"

    const context = canvas.getContext("2d")
    context.lineWidth = 3
    context.lineCap = "round"
    context.lineJoin = "round"
    contextRef.current = context
  }

  const draw = (startingPoint, endingPoint) => {
    contextRef.current.beginPath()
    contextRef.current.moveTo(startingPoint.x, startingPoint.y)
    contextRef.current.lineTo(endingPoint.x, endingPoint.y)
    contextRef.current.stroke()
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

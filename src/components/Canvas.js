import React, { useEffect } from "react"
import { useCanvasContext } from "./CanvasContext"

const Canvas = () => {
  const {
    canvasRef,
    mouseDown,
    mouseMove,
    mouseUp,
    stopDrawing,
    resumeDrawing,
    initCanvas,
  } = useCanvasContext()

  useEffect(() => {
    initCanvas()
  }, [])

  return (
    <canvas
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onMouseOut={stopDrawing}
      onMouseEnter={resumeDrawing}
      ref={canvasRef}
    />
  )
}

export default Canvas

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
    tmpCanvasRef,
  } = useCanvasContext()

  useEffect(() => {
    initCanvas()
  }, [])

  return (
    <div style={{ position: "relative" }}>
      <canvas
        onMouseDown={mouseDown}
        onMouseMove={mouseMove}
        onMouseUp={mouseUp}
        onMouseOut={stopDrawing}
        onMouseEnter={resumeDrawing}
        ref={canvasRef}
        style={{ position: "absolute", zIndex: 10 }}
      />
      <canvas ref={tmpCanvasRef} style={{ position: "absolute", zIndex: 5 }} />
    </div>
  )
}

export default Canvas

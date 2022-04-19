import React from "react"
import { useCanvasContext } from "./CanvasContext.js"

const Button = ({ text }) => {
  const { setTool, clearCanvas, reDraw } = useCanvasContext()

  const performAction = () => {
    if (text === "pencil" || text === "eraser" || text === "line") {
      setTool(text)
    } else if (text === "clear") {
      clearCanvas()
    } else if (text === "redraw") {
      reDraw()
    }
  }

  return (
    <button
      onClick={() => {
        performAction()
      }}
    >
      {text}
    </button>
  )
}

export default Button

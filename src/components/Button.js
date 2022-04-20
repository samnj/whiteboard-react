import React from "react"
import { useCanvasContext } from "./CanvasContext.js"

const Button = ({ text }) => {
  const { setTool, clearCanvas, reDraw, undo, redo } = useCanvasContext()

  const performAction = () => {
    if (text === "pencil" || text === "eraser" || text === "line") {
      setTool(text)
    } else if (text === "clear") {
      clearCanvas()
    } else if (text === "redraw") {
      reDraw()
    } else if (text === "undo") {
      undo()
    } else if (text === "redo") {
      redo()
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

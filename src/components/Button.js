import React from "react"
import { useCanvasContext } from "./CanvasContext.js"

const Button = ({ text }) => {
  const { setTool, style, setStyle, clearCanvas, reDraw, undo, redo } =
    useCanvasContext()

  const performAction = () => {
    if (text === "pencil" || text === "line") {
      setTool(text)
      setStyle({ color: style.prevColor })
    } else if (text === "clear") {
      clearCanvas()
    } else if (text === "redraw") {
      reDraw()
    } else if (text === "undo") {
      undo()
    } else if (text === "redo") {
      redo()
    } else if (text === "eraser") {
      setTool(text)
      setStyle((prevStyle) => ({
        prevColor: prevStyle.color,
        color: "white",
      }))
    } else if (text === "black" || text === "red" || text === "blue") {
      setStyle({ color: `${text}` })
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

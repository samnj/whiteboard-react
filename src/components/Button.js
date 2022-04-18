import React from "react"
import { useCanvasContext } from "./CanvasContext.js"

const Button = ({ text }) => {
  const { setTool } = useCanvasContext()

  return (
    <button
      onClick={() => {
        setTool(text)
      }}
    >
      {text}
    </button>
  )
}

export default Button

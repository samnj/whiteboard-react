import React from "react"
import { useCanvasContext } from "./CanvasContext.js"

const WidthSlider = () => {
  const { handleWidth } = useCanvasContext()

  return (
    <>
      <input
        name="widthSlider"
        type="range"
        defaultValue="5"
        min="2"
        max="20"
        step="3"
        onChange={(e) => {
          handleWidth(e)
        }}
      />
      <label htmlFor="widthSlider">Brush Thickness</label>
    </>
  )
}

export default WidthSlider

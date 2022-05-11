import React from "react"
import Button from "./Button.js"
import WidthSlider from "./WidthSlider"

const Toolbar = () => {
  const toolbar = [
    "pencil",
    "eraser",
    "line",
    "clear",
    "undo",
    "redo",
    "redraw",
    "black",
    "red",
    "blue",
  ]

  return (
    <div>
      {toolbar.map((tool) => {
        return <Button key={tool} text={tool} />
      })}
      <WidthSlider />
    </div>
  )
}

export default Toolbar

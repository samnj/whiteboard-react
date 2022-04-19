import React from "react"
import Button from "./Button.js"

const Toolbar = () => {
  const toolbar = [
    "pencil",
    "eraser",
    "line",
    "clear",
    "undo",
    "redo",
    "redraw",
  ]

  return (
    <div>
      {toolbar.map((tool) => {
        return <Button key={tool} text={tool} />
      })}
    </div>
  )
}

export default Toolbar

import React from "react"
import Button from "./Button.js"
import { useCanvasContext } from "./CanvasContext.js"

const Toolbar = () => {
  return (
    <div>
      <Button text={"pencil"} />
      <Button text={"eraser"} />
      <Button text={"clear"} />
      <Button text={"undo"} />
      <Button text={"redo"} />
    </div>
  )
}

export default Toolbar

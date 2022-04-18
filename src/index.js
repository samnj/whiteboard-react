import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { CanvasProvider } from "./components/CanvasContext"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <CanvasProvider>
    <App />
  </CanvasProvider>
)

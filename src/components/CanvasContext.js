import React, {
  useRef,
  useState,
  useContext,
  createContext,
  useEffect,
  useReducer,
} from "react"

import isEqual from "lodash.isequal"

const CanvasContext = createContext()

export const CanvasProvider = (props) => {
  const canvasRef = useRef(null)
  const [ctx, setCtx] = useState(null)

  // A canvas layer used for drawings that require too many redraws,
  // aka straight lines preview
  const tmpCanvasRef = useRef(null)
  const [tmpCtx, setTmpCtx] = useState(null)

  const isMouseDownRef = useRef(false)
  const isMovingRef = useRef(false)

  const [pointerPos, setPointerPos] = useState([])
  const [prevPointerPos, setPrevPointerPos] = useState([])

  const [tool, setTool] = useState("pencil")

  const initialState = {
    strokes: [],
    history: [],
    undoHistory: [],
  }

  const ACTIONS = {
    ADD_STROKE: "add_stroke",
    UPDATE_HISTORY: "update_history",
    UNDO: "undo",
    REDO: "redo",
  }

  const historyReducer = (prevState, action) => {
    switch (action.type) {
      case ACTIONS.ADD_STROKE:
        return {
          ...prevState,
          strokes: [...prevState.strokes, action.payload],
        }
      case ACTIONS.UPDATE_HISTORY:
        return {
          ...prevState,
          history: [...prevState.history, [prevState.strokes]],
          strokes: [],
        }
      case ACTIONS.UNDO:
        return {
          ...prevState,
          undoHistory: [...prevState.undoHistory, [...prevState.history].pop()],
          history: [...prevState.history].slice(0, -1),
        }
      case ACTIONS.REDO:
        return {
          ...prevState,
          history: [...prevState.history, [...prevState.undoHistory].pop()],
          undoHistory: [...prevState.undoHistory].slice(0, -1),
        }
      default:
        return prevState
    }
  }

  const [state, dispatch] = useReducer(historyReducer, initialState)

  useEffect(() => {
    if (!ctx) return
    reDraw()
  }, [state.undoHistory])

  const initCanvas = () => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.cursor = "crosshair"

    const context = canvas.getContext("2d")
    context.lineWidth = 6
    context.lineCap = "round"
    context.lineJoin = "round"
    setCtx(context)

    const tmpCanvas = tmpCanvasRef.current
    tmpCanvas.width = window.innerWidth
    tmpCanvas.height = window.innerHeight
    tmpCanvas.style.cursor = "crosshair"

    const tmpContext = tmpCanvas.getContext("2d")
    tmpContext.lineWidth = 6
    tmpContext.lineCap = "round"
    tmpContext.lineJoin = "round"
    setTmpCtx(tmpContext)
  }

  const mouseDown = (e) => {
    isMouseDownRef.current = true
    setPointerPos(getPos(e))
    setPrevPointerPos(getPos(e))
  }

  const mouseMove = (e) => {
    if (!isMouseDownRef.current) return

    isMovingRef.current = true
    setPointerPos(getPos(e))
    if (tool === "pencil") {
      draw(prevPointerPos, pointerPos, ctx, true)
    } else if (tool === "eraser") {
      erase()
    } else if (tool === "line") {
      clearTmpCanvas()
      draw(prevPointerPos, pointerPos, tmpCtx, false)
      return
    }
    setPrevPointerPos(pointerPos)
  }

  const mouseUp = () => {
    if (!isMovingRef.current && isMouseDownRef.current) {
      if (tool === "pencil") {
        draw(prevPointerPos, pointerPos, ctx)
      } else if (tool === "eraser") {
        erase()
      }
    }
    if (tool === "line" && !isEqual(prevPointerPos, pointerPos)) {
      draw(prevPointerPos, pointerPos, ctx, true)
      clearTmpCanvas()
    }
    stopDrawing()
    dispatch({ type: ACTIONS.UPDATE_HISTORY })
  }

  const getPos = (e) => {
    const { offsetX, offsetY } = e.nativeEvent
    return [offsetX, offsetY]
  }

  const draw = (A, B, context, saveStroke) => {
    context.beginPath()
    context.moveTo(A[0], A[1])
    context.lineTo(B[0], B[1])
    context.stroke()
    if (!saveStroke) return
    dispatch({ type: ACTIONS.ADD_STROKE, payload: [A, B] })
  }

  const erase = () => {
    const squareX = pointerPos[0] - 15
    const squareY = pointerPos[1] - 15
    ctx.clearRect(squareX, squareY, 30, 30)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const clearTmpCanvas = () => {
    const tmpCanvas = tmpCanvasRef.current
    tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height)
  }

  const reDraw = () => {
    const canvas = canvasRef.current
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let buffer = []
    for (let i = 0; i < state.history.length; i++) {
      state.history[i].forEach((element) => {
        buffer = [...buffer, ...element]
      })
    }
    buffer.forEach((drawing) => draw(drawing[0], drawing[1], ctx, false))
  }

  const undo = () => {
    if (!state.history.length) return
    dispatch({ type: ACTIONS.UNDO })
  }

  const redo = () => {
    if (!state.undoHistory.length) return
    dispatch({ type: ACTIONS.REDO })
  }

  const stopDrawing = () => {
    isMouseDownRef.current = false
    isMovingRef.current = false
  }

  const resumeDrawing = (e) => {
    if (e.nativeEvent.buttons === 1) {
      mouseDown(e)
    }
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        mouseDown,
        mouseMove,
        mouseUp,
        stopDrawing,
        resumeDrawing,
        initCanvas,
        setTool,
        clearCanvas,
        reDraw,
        tmpCanvasRef,
        undo,
        redo,
      }}
    >
      {props.children}
    </CanvasContext.Provider>
  )
}

export const useCanvasContext = () => useContext(CanvasContext)

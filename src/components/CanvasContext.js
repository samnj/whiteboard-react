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
  const ctxRef = useRef(null)

  // A canvas layer used for drawings that require too many redraws,
  // aka straight lines preview
  const tmpCanvasRef = useRef(null)
  const tmpCtxRef = useRef(null)

  const isMouseDownRef = useRef(false)
  const isMovingRef = useRef(false)

  const [pointerPos, setPointerPos] = useState({})
  const [prevPointerPos, setPrevPointerPos] = useState({})

  const [tool, setTool] = useState("pencil")
  const [style, setStyle] = useState({
    color: "black",
    prevColor: "black",
  })

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
    if (!ctxRef.current) return
    reDraw()
  }, [state.undoHistory])

  const initCanvas = () => {
    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight
    canvasRef.current.style.cursor = "crosshair"

    ctxRef.current = canvasRef.current.getContext("2d")
    ctxRef.current.lineWidth = 5
    ctxRef.current.lineCap = "round"
    ctxRef.current.lineJoin = "round"

    tmpCanvasRef.current.width = window.innerWidth
    tmpCanvasRef.current.height = window.innerHeight
    tmpCanvasRef.current.style.cursor = "crosshair"

    tmpCtxRef.current = tmpCanvasRef.current.getContext("2d")
    tmpCtxRef.current.lineWidth = 5
    tmpCtxRef.current.lineCap = "round"
    tmpCtxRef.current.lineJoin = "round"
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
    if (tool === "line") {
      clearTmpCanvas()
      draw(prevPointerPos, pointerPos, tmpCtxRef.current, false, style)
      return
    }
    draw(prevPointerPos, pointerPos, ctxRef.current, true, style)
    setPrevPointerPos(pointerPos)
  }

  const mouseUp = () => {
    if (!isMovingRef.current && isMouseDownRef.current) {
      draw(prevPointerPos, pointerPos, ctxRef.current, true, style)
    }
    if (tool === "line" && !isEqual(prevPointerPos, pointerPos)) {
      clearTmpCanvas()
      draw(prevPointerPos, pointerPos, ctxRef.current, true, style)
    }
    stopDrawing()
    dispatch({ type: ACTIONS.UPDATE_HISTORY })
  }

  const getPos = (e) => {
    const { offsetX, offsetY } = e.nativeEvent
    return { x: offsetX, y: offsetY }
  }

  const draw = (pointA, pointB, context, saveStroke, styleConfig) => {
    context.beginPath()
    context.moveTo(pointA.x, pointA.y)
    context.lineTo(pointB.x, pointB.y)
    context.strokeStyle = styleConfig.color
    context.stroke()
    if (!saveStroke) return
    dispatch({
      type: ACTIONS.ADD_STROKE,
      payload: { pointA, pointB, styleConfig },
    })
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height)
  }

  const clearTmpCanvas = () => {
    const tmpCanvas = tmpCanvasRef.current
    tmpCtxRef.current.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height)
  }

  const reDraw = () => {
    const canvas = canvasRef.current
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height)

    let buffer = []
    for (let i = 0; i < state.history.length; i++) {
      state.history[i].forEach((element) => {
        buffer = [...buffer, ...element]
      })
    }
    buffer.forEach((drawing) =>
      draw(
        drawing.pointA,
        drawing.pointB,
        ctxRef.current,
        false,
        drawing.styleConfig
      )
    )
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

  const handleWidth = ({ target }) => {
    ctxRef.current.lineWidth = target.value
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
        style,
        setStyle,
        clearCanvas,
        reDraw,
        tmpCanvasRef,
        undo,
        redo,
        handleWidth,
      }}
    >
      {props.children}
    </CanvasContext.Provider>
  )
}

export const useCanvasContext = () => useContext(CanvasContext)

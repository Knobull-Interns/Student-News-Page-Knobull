import { useThemeToken } from "@/hooks"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useStyle from "./style"
export type CloseType = "all" | "right" | "left" | "current"

interface ContextMenuProps {
  isCurrent: boolean
  visible: boolean
  x: number
  y: number
  setVisible: (v: boolean) => void
  onClose: (t: CloseType) => void
}

const onContextMenu: React.MouseEventHandler<HTMLDivElement> = (e) => {
  e.stopPropagation()
  e.preventDefault()
}


export default function ContextMenu({ isCurrent, visible, x, y, setVisible, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLUListElement>(null)
  const [style, setStyle] = useState({})
  const token = useThemeToken()
  const { styles } = useStyle({ visible, token })
  const visibility = useMemo(() => {
    if (visible) {
      document.body.style.overflow = "hidden"
      return "visible"
    }
    document.body.style.overflow = "unset"
    return "hidden"
  }, [visible])

  useEffect(() => {
    const wwidth = window.screen.availWidth || document.body.offsetWidth
    const width = ref.current?.offsetWidth || 0
    let left = x, top = y;
    if (x + width > wwidth) {
      left = x - width
    }
    const newStyle = { left, top, visibility }
    setStyle(newStyle)
  }, [x, y, visibility, ref])
  // Close Menu
  const closeMenu = useCallback(() => {
    if (visibility === "visible") {
      console.log("Close Popup");
      setVisible(false)
    }
    return false
  }, [setVisible, visibility])

  // Close all tabs
  const closeAll = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation()
    console.log("Close All");
    onClose("all")
    closeMenu()
  }, [closeMenu, onClose])

  // Close Right Tabs
  const closeRight = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation()
    console.log("Right");
    onClose("right")
    closeMenu()
  }, [closeMenu, onClose])

  // Close Left Tabs
  const closeLeft = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation()
    console.log("Left");
    onClose("left")
    closeMenu()
  }, [closeMenu, onClose])

  // Close Current Tab
  const closeCurrent = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation()
    console.log("Current");
    onClose("current")
    closeMenu()
  }, [closeMenu, onClose])

  return <div
    onContextMenu={onContextMenu}
    onMouseUp={closeMenu}
    className={styles.centextMenu}
  >
    <ul style={style} ref={ref}>
      <li onMouseUp={closeAll}>Close All</li>
      <li onMouseUp={closeRight}>Close Right</li>
      <li onMouseUp={closeLeft}>CLose Left</li>
      {
        isCurrent && <li onMouseUp={closeCurrent}>Close Current</li>
      }
    </ul>
  </div>
}
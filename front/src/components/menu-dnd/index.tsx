import React, { useEffect, useState, useCallback, useMemo } from "react";
import MyIcon from "@/components/icon";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Link, useNavigate } from "react-router-dom";
import useStyle from "./style"
import { OpenedMenu } from "@/types"
import { message } from "antd";
import ContextMenu, { CloseType } from "../contextMenu";
import { useDispatchMenu, useStateCurrentPath, useStateOpenedMenu } from "@/store/hooks";
import { useThemeToken } from "@/hooks";
// Re-record array order
const reorder = (list: OpenedMenu[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  //Delete and record the remoced element
  const [removed] = result.splice(startIndex, 1);
  //Add the original element back into the array
  result.splice(endIndex, 0, removed);
  return result;
};

function MenuDnd() {
  const [data, setData] = useState<OpenedMenu[]>([]);
  const [contextMenuVisible, setVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState<OpenedMenu | null>(null)
  const [point, setPoint] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()
  const openedMenu = useStateOpenedMenu()
  const currentPath = useStateCurrentPath()
  const { stateFilterOpenMenuKey: filterOpenMenu } = useDispatchMenu()
  const token = useThemeToken()
  const { styles } = useStyle(token)
  // Add drag optons based on the selected menu
  useEffect(() => {
    if (data.length !== openedMenu.length) {
      let old = [...data];
      openedMenu.forEach((item) => {
        if (!data.find((i) => i.path === item.path)) {
          old.push(item);
        }
      });
      old = old.filter((i) => openedMenu.find((item) => item.path === i.path));
      setData(old)
    }
  }, [openedMenu, data]);

  //Drag and drop ends
  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) {
      return;
    }
    //Get the data after dragging and reassign
    const newData = reorder(data, result.source.index, result.destination.index);
    setData(newData);
  }, [data]);

  // Close current toop menu
  const closeCurrent = useCallback((item: OpenedMenu) => {
    const newData = data.filter((i) => i.path !== item.path);
    const next = newData[newData.length - 1];
    if (next) {
      setData(newData);
    }
    const isCurrent = item.path === currentPath
    filterOpenMenu([item.path])
    if (next && isCurrent) {
      navigate(next.path, { replace: true });
    } else if (isCurrent && !next) {
      navigate("/", { replace: true })
    }
  }, [data, currentPath, filterOpenMenu, navigate]);

  // Close the right side
  const closeRight = useCallback(() => {
    if (!currentItem) {
      return
    }
    const findIndex = data.findIndex(item => item.path === currentItem.path)
    console.log(findIndex);
    // If you choose to close the right side at the last one
    if (findIndex === data.length - 1) {
      return message.warning("No item to close on the right")
    }
    const keys = data.slice(findIndex + 1).map(i => i.path)
    console.log(keys);
    filterOpenMenu(keys)
    navigate(currentItem.path, { replace: true })

  }, [currentItem, data, filterOpenMenu, navigate])

  // Close the left side
  const closeLeft = useCallback(() => {
    if (!currentItem) {
      return
    }
    const findIndex = data.findIndex(item => item.path === currentItem.path)
    console.log(findIndex);
    // If you choose to close the left side at the last one
    if (findIndex === 0) {
      return message.warning("No items to close on the left")
    }
    const keys = data.slice(0, findIndex).map(i => i.path)
    console.log(keys);
    filterOpenMenu(keys)
    navigate(currentItem.path, { replace: true })
  }, [currentItem, data, filterOpenMenu, navigate])

  // CLose All
  const closeAll = useCallback(() => {
    const keys = data.map(i => i.path)
    console.log(keys);
    filterOpenMenu(keys)
    navigate("/", { replace: true })
  }, [data, filterOpenMenu, navigate])

  // Right-click to open the pop-up menu
  const onContextMenu = useCallback((e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>, item: OpenedMenu) => {
    const { clientX: x, clientY: y } = e
    e.stopPropagation()
    e.preventDefault()
    setVisible(true)
    setCurrentItem(item)
    setPoint({ x, y })
    return false
  }, [])

  // Right-click to close
  const onContextMenuClose = useCallback((type: CloseType) => {
    switch (type) {
      case "current":
        closeCurrent(currentItem as OpenedMenu)
        break;
      case "right":
        closeRight()
        break
      case "left":
        closeLeft()
        break
      case "all":
        closeAll()
        break
      default:
        break;
    }
  }, [closeCurrent, currentItem, closeRight, closeLeft, closeAll])

  // Drag list
  const DraggableList = useMemo(() => {
    if (data.length) {
      return data.map((item, index) => {
        const clsname = currentPath === item.path ? "active " : ""
        const iconClick: React.MouseEventHandler<HTMLSpanElement> = (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeCurrent(item);
        }
        return <Draggable index={index} key={item.path} draggableId={item.path}>
          {(provided) => (
            //Write your drag and drop component style, DOM, etc. here
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onContextMenu={(e) => onContextMenu(e, item)}
              style={{ ...provided.draggableProps.style, display: "inline-block" }}>
              <Link
                className={clsname + styles.dndItem}
                to={item.path}
              >
                {item.title}
                <MyIcon
                  className="anticon-close"
                  type="icon_close"
                  onClick={iconClick}
                />
              </Link>
            </div>
          )}
        </Draggable>
      })
    }
    return null
  }, [data, currentPath, styles, onContextMenu, closeCurrent])

  return (<>
    <DragDropContext onDragEnd={onDragEnd}>
      {/* direction represents the drag direction, the default is vertical, horizontal: horizontal */}
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided) => (
          //This is the drag container, set the width and height of the container here...
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={"hide-scrollbar " + styles.dndDody}
          >
            {/* Place the components you need to drag here, they must be wrapped by Draggable */}
            {DraggableList}
            {/* Thie cannot be missed */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    <ContextMenu
      {...point}
      isCurrent={Boolean(currentItem && currentItem.path === currentPath)}
      onClose={onContextMenuClose}
      visible={contextMenuVisible}
      setVisible={setVisible}
    />
  </>);
}

export default MenuDnd

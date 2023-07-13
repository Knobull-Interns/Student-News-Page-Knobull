import * as actionTypes from "./actionTypes";
import { MenuAction, MenuState } from "@/types";

const initGlobalState: MenuState = {
  openedMenu: [], // Save the already opened menu for the top navigation
  openMenuKey: [], // The key of the opened menue for the sidebar
  selectMenuKey: [], // The key of the selected menu for the sidebar
  menuList: [],
  currentPath: "", // Current page path
};

export default function reducer(
  state = initGlobalState,
  action: MenuAction
): MenuState {
  const { type, menuItem, keys, list, path } = action;
  switch (type) {
    case actionTypes.ADDOPENTMENU: {
      if (menuItem && !state.openedMenu.find((i) => i.path === menuItem.path)) {
        const openedMenu = [...state.openedMenu];
        openedMenu.push(menuItem);
        return { ...state, openedMenu };
      }
      return state;
    }
    case actionTypes.SET_OPENKEY: {
      let oldKeys = state.openMenuKey;
      let isSame = keys.every((item, index) => item === oldKeys[index]);
      let flag = keys.length === oldKeys.length && isSame;
      if (flag) {
        return state;
      }
      return { ...state, openMenuKey: keys };
    }
    case actionTypes.SET_SELECTKEY: {
      if (state.selectMenuKey[0] === keys[0]) {
        return state;
      }
      return { ...state, selectMenuKey: keys };
    }
    case actionTypes.FILTER_OPENKEY: {
      const openedMenu = state.openedMenu.filter((i) => !keys.includes(i.path));
      if (state.openedMenu.length === openedMenu.length) {
        return state;
      }
      return { ...state, openedMenu };
    }
    case actionTypes.SET_USERMENU: {
      return { ...state, menuList: list };
    }
    case actionTypes.SETCURRENTPATH: {
      return { ...state, currentPath: path };
    }
    default: {
      return state;
    }
  }
}

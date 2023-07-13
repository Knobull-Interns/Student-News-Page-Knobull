// This is a utility file with various helper functions related to managing session storage, local storage,
// user inofrmation, authentication tokens, menu handling, and layout mode.

import { getMenus } from "@/common";
import {
  MenuItem,
  MenuList,
  UserInfo,
  LayoutMode,
  MenuResponse,
  State,
  MenuMap,
} from "@/types";
export const USER_INFO = "USER_INFO";
export const WEB_USER_INFO = "WEB_USER_INFO";
export const TOKEN = "REACT_ADMIN_TOKEN";
export const WEBTOKEN = "REACT_WEB_TOKEN";
export const MENU = "MENU";
export const VISIBLE = "COMPONENTS_VISIBLE";
export const LAYOUT_MODE = "LAYOUT_MODE";

interface MenuOpenData {
  openKeys: string[];
  selectKey: string[];
  openedMenu: MenuItem[];
}
type Token = string | null | undefined;

// Get the default page
async function getDefaultMenu(): Promise<MenuOpenData> {
  let openKeys: string[] = [],
    selectKey: string[] = [],
    openedMenu: MenuItem[] = [];
  const menuList = await getMenus();
  menuList.some((list) => {
    const child = list[MENU_CHILDREN];
    if (child && child.length) {
      openKeys = [list[MENU_KEY] as string];
      selectKey = [child[0][MENU_KEY] as string];
      openedMenu = [child[0]];
      return true;
    }
    return false;
  });

  return {
    openKeys,
    selectKey,
    openedMenu,
  };
}

function getSessionUser() {
  return getKey(false, USER_INFO);
}

function getWebUser() {
  return getKey(false, WEB_USER_INFO);
}

function saveUser(info: UserInfo) {
  setKey(true, USER_INFO, info);
  setKey(false, USER_INFO, info);
}

function saveWebUser(info: UserInfo) {
  console.log(info);
  setKey(true, WEB_USER_INFO, info);
  setKey(false, WEB_USER_INFO, info);
}

function sleep(seconed: number) {
  return new Promise((res, rej) => {
    setTimeout(res, seconed);
  });
}

function getLocalUser() {
  return getKey(true, USER_INFO);
}

function getLocalWebUser() {
  return getKey(true, WEB_USER_INFO);
}

function getMenuParentKey(list: MenuList, key: string): string[] {
  const keys = [];
  const info = list.find((item) => item[MENU_KEY] === key);
  let parentKey = info?.[MENU_PARENTKEY];
  if (parentKey) {
    const data = getMenuParentKey(list, parentKey);
    keys.push(...data);
    keys.push(parentKey);
  }
  return keys;
}

export function formatMenu(list: MenuList) {
  const newList = list.map((item) => ({ ...item }));
  const menuMap: MenuMap = {};
  const parentMenu: MenuList = [];
  newList.forEach((item) => {
    // The key of the current menu
    const currentKey = item[MENU_KEY];
    // The key of the parent menu of the current menu
    const currentParentKey = item[MENU_PARENTKEY];
    // If the mapping table does not have a value, then assign the current item to it
    if (!menuMap[currentKey]) {
      menuMap[currentKey] = item;
    } else {
      // If there is a value, it means there is a child item, keep the child item and assign the current value to it
      item[MENU_CHILDREN] = menuMap[currentKey][MENU_CHILDREN];
      menuMap[currentKey] = item;
    }
    // If the current item has a parent
    if (currentParentKey) {
      // If the paret is not in the mapping table yet
      if (!menuMap[currentParentKey]) {
        // Then map is ,it only has the "children" property of Array type
        menuMap[currentParentKey] = {
          [MENU_CHILDREN]: [item],
        };
      } else if (
        menuMap[currentParentKey] &&
        !menuMap[currentParentKey][MENU_CHILDREN]
      ) {
        // The parent is on the mapping table, but there is no child set
        menuMap[currentParentKey][MENU_CHILDREN] = [item];
      } else {
        // The parent has a set of children
        menuMap[currentParentKey][MENU_CHILDREN]?.push(item);
      }
    } else {
      // If the current item does not have a parent, then the current item is a parent item
      parentMenu.push(item);
    }
  });
  return parentMenu;
}

function reduceMenuList(list: MenuList, path: string = ""): MenuList {
  const data: MenuList = [];
  list.forEach((i) => {
    const { children, ...item } = i;
    item.parentPath = path;
    if (children) {
      const childList = reduceMenuList(children, path + i.path);
      data.push(...childList);
    }
    data.push(item);
  });
  return data;
}

function getLocalMenu(): MenuResponse | null {
  return getKey(false, MENU);
}

function saveLocalMenu(list: MenuResponse) {
  setKey(false, MENU, list);
}

function saveToken(token: Token) {
  setKey(true, TOKEN, token);
}

function saveWebToken(token: Token) {
  setKey(true, WEBTOKEN, token);
}

function getToken(): Token {
  return getKey(true, TOKEN);
}

function getKey(isLocal: boolean, key: string) {
  return JSON.parse(getStorage(isLocal).getItem(key) || "null");
}
function getStorage(isLocal: boolean) {
  return isLocal ? window.localStorage : window.sessionStorage;
}
function setKey(isLocal: boolean, key: string, data: any) {
  getStorage(isLocal).setItem(key, JSON.stringify(data || null));
}

function rmKey(isLocal: boolean, key: string) {
  getStorage(isLocal).removeItem(key);
}

function stopPropagation(e: MouseEvent) {
  e.stopPropagation();
}

function getLayoutMode(): LayoutMode[] | null {
  return getKey(true, LAYOUT_MODE);
}
function setLayoutMode(data: LayoutMode[]) {
  setKey(true, LAYOUT_MODE, data);
}
function clearLocalDatas(keys: string[]) {
  keys.forEach((key) => {
    rmKey(true, key);
    rmKey(false, key);
  });
}

export {
  getDefaultMenu,
  getSessionUser,
  getWebUser,
  saveUser,
  saveWebUser,
  sleep,
  getLocalUser,
  getLocalWebUser,
  getMenuParentKey,
  reduceMenuList,
  getLocalMenu,
  saveLocalMenu,
  saveToken,
  saveWebToken,
  getToken,
  getKey,
  setKey,
  rmKey,
  stopPropagation,
  getLayoutMode,
  setLayoutMode,
  clearLocalDatas,
};

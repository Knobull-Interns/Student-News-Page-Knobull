import { getSessionUser, getWebUser } from "@/utils";
import { UserInfo, UserAction } from "@/types";
import * as actionTypes from "./actionTypes";
const initState: any = {
  userInfo: getSessionUser(),
  webUserInfo: getWebUser(),
};

export default function reducer(state = initState, action: UserAction) {
  const { type, info } = action;
  switch (type) {
    case actionTypes.SET_USERINFO:
      return { ...state, userInfo: info };
    case actionTypes.SET_WEB_USERINFO:
      return { ...state, webUserInfo: info };
    case actionTypes.CLEAR_USERINFO: {
      return null;
    }
    default:
      return state;
  }
}

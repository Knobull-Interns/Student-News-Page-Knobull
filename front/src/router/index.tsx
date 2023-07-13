import { useEffect, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import routerList, { RouterInfo } from "./list";
import Intercept from "./intercept";
import { getMenus } from "@/common";
import { formatMenu, reduceMenuList } from "@/utils";
import { MenuList } from "@/types";
import { useDispatchMenu } from "@/store/hooks";

const Router = () => {
  const { stateSetMenuList } = useDispatchMenu();
  const [mergeRouterList, setMergeList] = useState<RouterInfo[]>([]); // The result of merging local and returned route list from API
  const [ajaxUserMenuList, setAjaxUserMenuList] = useState<MenuList>([]); // The route list returned from the network request

  useEffect(() => {
    if (stateSetMenuList && typeof stateSetMenuList === "function") {
      getMenus().then((list) => {
        const formatList = formatMenu(list);
        const userMenus = reduceMenuList(formatList);
        // Merge the data from the request and the route list exposed by the local pages
        let routers = routerList.map((router) => {
          let find = userMenus.find(
            (i) =>
              (i[MENU_PARENTPATH] || "") + i[MENU_PATH] === router[MENU_PATH]
          );
          if (find) {
            router = { ...find, ...router }; // Local takes precedence over API result
          } else {
            router[MENU_KEY] = router[MENU_PATH];
          }
          return router;
        });
        if (list && list.length) {
          stateSetMenuList(formatList);
          setAjaxUserMenuList(userMenus);
          setMergeList(routers);
        }
      });
    }
  }, [stateSetMenuList]);

  const routerBody = useMemo(() => {
    // Listen to local routing list, render routing component when they both have length greater than 1
    if (mergeRouterList.length) {
      return mergeRouterList.map((item) => {
        let { [MENU_KEY]: key, [MENU_PATH]: path } = item;
        return (
          <Route
            key={key}
            path={path}
            element={
              <Intercept {...item} menuList={ajaxUserMenuList} pageKey={key} />
            }
          />
        );
      });
    }
  }, [ajaxUserMenuList, mergeRouterList]);

  return <Routes>{routerBody}</Routes>;
};

export default Router;

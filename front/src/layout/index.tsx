import { FullScreen, SingleColumn, TowColumn, TwoFlanks } from "./mode";
import * as ActionTypes from "../store/layout/actionTypes";
import "./index.less";
import { useStateLayout } from "@/store/hooks";

const LayoutContainer = () => {
  const LayoutMode = useStateLayout();
  switch (LayoutMode) {
    case ActionTypes.SINGLE_COLUMN:
      return <SingleColumn />;
    case ActionTypes.TWO_COLUMN:
      return <TowColumn />;
    case ActionTypes.TWO_FLANKS:
      return <TwoFlanks />;
    case ActionTypes.FULL_SCREEN:
      return <FullScreen />;
    default:
      return <TowColumn />;
  }
};

export default LayoutContainer;

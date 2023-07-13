import { useCallback, useEffect, useState } from "react";
import {
  Drawer,
  Col,
  Row,
  message,
  Button,
  Radio,
  notification,
  RadioChangeEvent,
  theme,
} from "antd";
import MyIcon from "@/components/icon";
import Color from "@/components/color";
import { getKey, setKey, rmKey } from "@/utils";
import { useDispatchThemeToken } from "@/store/hooks";
import { useThemeToken } from "@/hooks";
import useStyle from "./style";
import { ThemeToken } from "@/types";
import { ColorResult } from "react-color";

let darkTheme = theme.darkAlgorithm(theme.defaultSeed),
  defaultTheme = theme.defaultAlgorithm(theme.defaultSeed);

interface ThemeData {
  label: string;
  value: string;
  colorList: ThemeToken;
}

interface GetColor {
  background: string;
}
type ThemeList = ThemeData[];
type ColorInfo = {
  pageX: number;
  pageY: number;
  key: string;
  value: string;
};

const getColor = (color: string): GetColor => ({
  background: color,
});

const Themes: ThemeList = [
  { label: "default", value: "default", colorList: defaultTheme as ThemeToken },
  { label: "dark", value: "dark", colorList: darkTheme as ThemeToken },
];

const THEMENAMEKEY = "theme-name";
const CUSTOMVARLESS = "CUSTOMVARLESS";
const localVarToken: { [key: string]: string } = getKey(true, CUSTOMVARLESS);
const THEME_NAME = getKey(true, THEMENAMEKEY);
const initVarToken = localVarToken || CUSTOMVARLESSDATA;
const initSelectInfo = { key: "", value: "", pageX: 0, pageY: 0 };

export default function SetTheme() {
  const [visible, setVisible] = useState(false);
  const [selectInfo, setInfo] = useState<ColorInfo>(initSelectInfo);
  const [colorShow, setColorShow] = useState(false);
  const [customColorMap, setCustomColorMap] = useState(initVarToken);
  const [themeStyle, setStyle] = useState(THEME_NAME || Themes[0].value);
  const { stateSetThemeToken } = useDispatchThemeToken();
  const token = useThemeToken();
  const { styles } = useStyle(token);
  // close the color panel
  const onCloseColor = useCallback(() => {
    setInfo(initSelectInfo);
    setColorShow(false);
  }, []);

  // Set the theme

  // Initialize the theme
  useEffect(() => {
    if (THEME_NAME) {
      let themeToken = {
        ...Themes.find((i) => i.value === THEME_NAME)?.colorList,
      };
      if (themeToken) {
        themeToken = Object.assign(themeToken, initVarToken);
        stateSetThemeToken(themeToken as ThemeToken);
      }
      setStyle(THEME_NAME);
    }
  }, []);

  // close the drawer
  const onClose = useCallback(() => setVisible(false), []);

  // show the drawer
  const showDrawer = useCallback(() => {
    setVisible(true);
  }, []);

  // custom color selected
  const onChangeComplete = useCallback(
    (v: ColorResult, k: string) => {
      const newData = { ...customColorMap, [k]: v.hex };
      setCustomColorMap(newData);
      const themeToken = Object.assign(token, newData);
      stateSetThemeToken(themeToken);
      onCloseColor();
    },
    [stateSetThemeToken, token, customColorMap, onCloseColor]
  );

  // Select
  const onSelect = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      key: string,
      value: string
    ) => {
      const height = window.innerHeight;
      const width = window.innerWidth;
      let { clientX: pageX, clientY: pageY } = e;
      if (pageY + 350 > height) {
        pageY -= 320;
      }
      if (pageX + 250 > width) {
        pageX -= 220;
      }
      setInfo({ value, key, pageX, pageY });
      setColorShow(true);
    },
    []
  );

  // Save locally
  const saveLocalTheme = useCallback(() => {
    let themeToken = {
      ...Themes.find((i) => i.value === themeStyle)?.colorList,
    };
    themeToken = Object.assign(themeToken, customColorMap);
    setKey(true, THEMENAMEKEY, themeStyle);
    setKey(true, CUSTOMVARLESS, customColorMap);
    message.success("主题成功保存到本地！");
  }, [themeStyle, customColorMap]);

  // Select a theme
  const themeChange = useCallback(
    (e: RadioChangeEvent) => {
      const { value } = e.target;
      const colorObj = Themes.find((i) => i.value === value)?.colorList;
      if (colorObj) {
        stateSetThemeToken(Object.assign(colorObj, customColorMap));
      }
      setStyle(value);
    },
    [customColorMap, stateSetThemeToken]
  );
  // Delete local cache theme
  const delTheme = useCallback(() => {
    if (!getKey(true, THEMENAMEKEY)) {
      return notification.error({
        type: "error",
        description:
          "Local configuration not found. Please save before clicking delete!",
        message: "Deletion failed",
      });
    }
    rmKey(true, CUSTOMVARLESS);
    rmKey(true, THEMENAMEKEY);
    setCustomColorMap(CUSTOMVARLESSDATA);
    let themeToken = Object.assign(Themes[0].colorList, CUSTOMVARLESSDATA);
    stateSetThemeToken(themeToken);
    setStyle(Themes[0].value);
    message.success("The local theme color has been deleted!");
  }, [setCustomColorMap]);
  return (
    <div className={styles.setTheme}>
      <div className="icon" onClick={showDrawer}>
        <MyIcon type="icon_pen" />
      </div>
      <Drawer
        className={styles.drawer}
        title="Set theme color"
        placement="right"
        closable={false}
        onClose={onClose}
        width={400}
        open={visible}
      >
        <Radio.Group
          options={Themes}
          onChange={themeChange}
          value={themeStyle}
          optionType="button"
          buttonStyle="solid"
        />
        <Row className={styles.colorRow + " primary"}>
          Customize Less variables:
        </Row>
        {Object.keys(customColorMap).map((i) => (
          <Row className={styles.colorRow} justify="space-between" key={i}>
            <Col>{i}:</Col>
            <Col
              className="color-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(e, i, customColorMap[i] || "");
              }}
              style={getColor(customColorMap[i] || "")}
            />
          </Row>
        ))}

        <Row justify="center" className="bottom">
          <Button type="primary" onClick={saveLocalTheme}>
            Save Locally
          </Button>
          <Button className="del" danger onClick={delTheme}>
            Delete Local Color Theme Configuration
          </Button>
        </Row>
        <Color
          pageX={selectInfo.pageX}
          pageY={selectInfo.pageY}
          color={selectInfo.value}
          colorKey={selectInfo.key}
          onSureChange={onChangeComplete}
          onClose={onCloseColor}
          isShow={colorShow}
        />
      </Drawer>
    </div>
  );
}

import { ReactNode, useEffect, useState } from "react";
import MyIcon from "@/components/icon";
import MyForm, { FormItemData } from "@/components/form";
import { Modal, Select, message, FormInstance } from "antd";
import { addMenu, getMenuInfo, editMenu } from "@/api";
import { MenuList, MenuItem } from "@/types";
import { ModalType, SelectInfo } from "@/pages/power/menu";
import ICON_JSON from "@/assets/json/iconfont.json";

import "./index.less";
interface IconItem {
  icon_id: string;
  name: string;
  font_class: string;
  unicode: string;
  unicode_decimal: number;
}

interface MenuModalProps {
  info: SelectInfo;
  modalType: ModalType;
  isShow: boolean;
  setShow: (s: boolean) => void;
  updateMenu: () => void;
  menus: MenuList;
}

interface ActiveFn {
  add: (data: MenuItem) => void;
  edit: (data: MenuItem) => void;
  addChild: (data: MenuItem) => void;
}
const ICON_PREFIX: string = ICON_JSON.css_prefix_text;
const ICON_DATA: IconItem[] = ICON_JSON.glyphs;
const { Option } = Select;
const titleType: {
  add: string;
  addChild: string;
  edit: string;
} = {
  add: "Add Menu",
  addChild: "Add subMenu",
  edit: "Modyfy Menu Information",
};

const initFormItems: FormItemData[] = [
  {
    itemType: "input",
    itemProps: {
      rules: [{ required: true, message: "Please fill in the menu title" }],
      label: "Menu Title",
      name: "title",
    },
    childProps: {
      placeholder: "Menu Title",
    },
  },
  {
    itemType: "input",
    itemProps: {
      rules: [{ required: true, message: "Please fill in the menu path" }],
      label: "Menu Path",
      name: "path",
    },
    childProps: {
      placeholder: "Menu Path",
    },
  },
  {
    itemType: "input",
    itemProps: {
      rules: [{ required: true, message: "Please fill in the menu key" }],
      label: "Menu Key",
      name: "key",
    },
    childProps: {
      placeholder: "Menu Key must be unique, otherwise creation fails",
    },
  },
  {
    itemType: "select",
    itemProps: {
      label: "Parent Menu",
      name: "parentKey",
    },
    childProps: {
      placeholder: "Parent Menu",
    },
  },
  {
    itemType: "select",
    itemProps: {
      label: "Menu Icon",
      name: "icon",
    },
    childProps: {
      placeholder: "Icon",
      allowClear: true,
      showSearch: true,
      getPopupContainer: (v: ReactNode) => v,
      children: ICON_DATA.map((icon) => (
        <Option value={ICON_PREFIX + icon.font_class} key={icon.icon_id}>
          <div className="icons">
            <MyIcon type={ICON_PREFIX + icon.font_class} />
            <span className="title"> {icon.font_class}</span>
          </div>
        </Option>
      )),
    },
  },
  {
    itemType: "radio",
    itemProps: {
      rules: [{ required: true, message: "Please select the menu cache mode" }],
      name: "keepAlive",
      label: "Is the page cached",
    },
    childProps: {
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },
  },
  {
    itemType: "inputNumber",
    itemProps: {
      className: "ipt-number",
      rules: [
        {
          type: "number",
          min: 0,
          max: 10000,
          message: "Please fill in the correct menu order size",
        },
        { required: true, message: "Please fill in the menu order size" },
      ],
      name: "order",
      label: "Menu Sorting",
    },
    childProps: {
      placeholder: "The smaller the value, the higher the priority",
    },
  },
];
export default function MenuModal({
  info,
  modalType = "add",
  isShow,
  setShow,
  updateMenu,
  menus = [],
}: MenuModalProps) {
  const [form, setForm] = useState<FormInstance | null>(null);
  const [activeFn] = useState<ActiveFn>({ add, edit, addChild: add });
  const [formItems, setItems] = useState<FormItemData[]>([]);
  // form item
  useEffect(() => {
    if (modalType !== "add" && menus && info) {
      let items = [...initFormItems.map((i) => ({ ...i }))];
      items.forEach((i) => {
        if (i.itemProps.name === "parentKey") {
          i.childProps = { ...i.childProps };
          i.childProps.disabled =
            modalType === "addChild" || (modalType === "edit" && info.isParent);
          i.childProps.children = menus.map((menu) => (
            <Option value={menu.key} key={menu.key}>
              <div className="icons">
                <MyIcon type={menu.icon} />
                <span className="title"> {menu.title}</span>
              </div>
            </Option>
          ));
        }
      });
      setItems(items);
    } else if (info && modalType === "add" && menus) {
      let items = [...initFormItems.map((i) => ({ ...i }))];
      items = items.filter((i) => i.itemProps.name !== "parentKey");
      setItems(items);
    }
  }, [modalType, info, menus]);

  useEffect(() => {
    if (modalType === "edit" && isShow && form) {
      getMenuInfo({ key: info && info.key }).then((res) => {
        if (res.status === 0 && res.data) {
          form.setFieldsValue(res.data);
        }
      });
    } else if (modalType === "addChild" && isShow && form) {
      form.setFieldsValue({
        parentKey: info && info.key,
      });
    }
  }, [modalType, isShow, info, form]);
  // Submit Form
  const submit = () => {
    form &&
      form.validateFields().then((values) => {
        let fn = activeFn[modalType];
        fn(values);
      });
  };

  const onCancel = () => {
    form && form.resetFields();
    setShow(false);
  };
  function edit(data: MenuItem) {
    editMenu(data).then((res) => {
      const { status, msg } = res;
      if (status === 0) {
        message.success(msg);
        onCancel();
        updateMenu();
      }
    });
  }
  function add(data: MenuItem) {
    addMenu(data).then((res) => {
      const { status, msg } = res;
      if (status === 0) {
        message.success(msg);
        onCancel();
        updateMenu();
      }
    });
  }
  return (
    <Modal
      maskClosable={false}
      title={titleType[modalType]}
      open={isShow}
      okText="Confirm"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={submit}
    >
      <MyForm handleInstance={setForm} items={formItems} />
    </Modal>
  );
}

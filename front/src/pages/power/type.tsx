import { useEffect, useState } from "react";
import { Button, Row, Col } from "antd";
import TypeModal, { Info } from "@/components/modal/type";
import { getPower } from "@/api";
import MyTable from "@/components/table";
import "./index.less";
import { MapKey, MenuList, PowerList } from "@/types";

function formatMenuKey(list: MenuList) {
  return list.map((item) => {
    item.key = item.menu_id;
    if (item.children) {
      item.children = formatMenuKey(item.children);
    }
    return item;
  });
}

function useTypes() {
  const [showModal, setShow] = useState(false);
  const [tableData, setData] = useState<PowerList>([]);
  const [tableCol, setCol] = useState<MapKey>([]);
  const [choose, setChoose] = useState<Info>(null);
  const [menuList, setMenuList] = useState<MenuList>([]);

  useEffect(() => {
    getTypeData();
    // eslint-disable-next-line
  }, []);
  const modalControl = (info: Info, open: boolean) => {
    setChoose(info);
    setShow(open);
  };
  const activeCol = {
    dataIndex: "active",
    key: "active",
    title: "Action",
    align: "center",
    render: (text: any, record: any) => (
      <Button type="link" onClick={() => modalControl(record, true)}>
        Edit
      </Button>
    ),
  };
  const renderTitle = () => (
    <Row justify="space-between" gutter={80}>
      <Col style={{ lineHeight: "32px" }}>Users Info List</Col>
      <Col>
        <Button type="primary" onClick={() => modalControl(null, true)}>
          Add Administrator
        </Button>
      </Col>
    </Row>
  );
  const getTypeData = () => {
    getPower().then((res) => {
      if (res.status === 0) {
        res.mapKey.push(activeCol);
        setMenuList(formatMenuKey(res.menu));
        setData(res.data);
        setCol(res.mapKey);
      }
    });
  };
  return {
    renderTitle,
    tableCol,
    tableData,
    showModal,
    choose,
    menuList,
    modalControl,
    getTypeData,
  };
}

export default function Types() {
  const {
    renderTitle,
    tableCol,
    tableData,
    showModal,
    choose,
    modalControl,
    menuList,
    getTypeData,
  } = useTypes();
  return (
    <div className="type-container">
      <MyTable
        rowKey="type_id"
        title={renderTitle}
        columns={tableCol}
        dataSource={tableData}
      />
      <TypeModal
        isShow={showModal}
        info={choose}
        menuList={menuList}
        onCancel={modalControl}
        onOk={getTypeData}
      />
    </div>
  );
}

Types.route = { [MENU_PATH]: "/admin/power/type" };

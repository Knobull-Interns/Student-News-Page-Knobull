import { useCallback, useEffect, useState } from "react";
import { MapKey, ResponseUserInfo } from "@/types";
import {
  getClassificationList,
  getArticleList,
  login,
  isPayArticle,
  payArticle,
} from "@/api";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";
import "./index.less";
import {
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Divider,
  Button,
} from "antd";
const { confirm } = Modal;
import MyIcon from "@/components/icon";
import {
  clearLocalDatas,
  getLocalWebUser,
  saveWebToken,
  saveWebUser,
  WEB_USER_INFO,
  WEBTOKEN,
  setKey,
} from "@/utils";
import React from "react";
import type { FormInstance } from "antd/es/form";
import { UserInfo } from "@/types";
import { setWebUserInfoAction } from "@/store/user/action";
import { useDispatch } from "react-redux";
import logo from "../../assets/images/knobullpic.jpg";

const IPT_RULE_USERNAME = [
  {
    required: true,
    message: "please input account",
  },
];

const IPT_RULE_PASSWORD = [
  {
    required: true,
    message: "please input password",
  },
];

export default function Home() {
  const [classifyData, setClassifyData] = useState<ResponseUserInfo[]>([]);
  const [classifyActive, setClassifyActive] = useState<number>(0);
  const [list, setList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = React.useRef<FormInstance>(null);
  const [btnLoad, setBtnLoad] = useState(false);
  const dispatch = useDispatch();
  const setUserInfo = useCallback(
    (info: UserInfo) => dispatch(setWebUserInfoAction(info)),
    [dispatch]
  );
  const [webUserInfo, setWebUserInfo] = useState<any>(null);
  const [params, setParams] = useState<any>({
    page: 1,
    pageSize: 4,
  });
  const [categoryId, setCategoryId] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const logout = useCallback(() => {
    clearLocalDatas([WEB_USER_INFO, WEBTOKEN]);
    saveWebToken(null);
    window.location.reload();
  }, [webUserInfo]);
  const getPopupContainer = (HTMLElement: HTMLElement) => HTMLElement;
  const dropdownRender = useCallback(
    () => <RightMenu logout={logout} />,
    [logout]
  );
  const RightMenu = ({ logout }: { logout: () => void }) => (
    <Menu className="right-down">
      <Menu.Item
        key="logout"
        onClick={logout}
        icon={<MyIcon type="icon_disconnectdevice" />}
      >
        Log out
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    getClassificationData();
    setWebUserInfo(getLocalWebUser());
  }, []);

  const getClassificationData = () => {
    getClassificationList().then((res) => {
      setClassifyData([{ name: "all", _id: -1 }].concat(res.data));
    });
  };

  const getArticleData = (refresh) => {
    if (loading) return false;
    setLoading(true);
    getArticleList({
      ...params,
      categoryId,
    })
      .then((res) => {
        setTimeout(() => {
          const data = refresh ? res.data : list.concat(res.data);
          setList(data);
          if (data.length >= res.total) {
            setHasMore(false);
          } else {
            setParams({
              ...params,
              page: params.page + 1,
            });
          }
        }, 3000);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      });
  };

  const articleDetail = async (item) => {
    if (item.charge && item.charge > 0) {
      if (!webUserInfo) {
        setIsModalOpen(true);
        return false;
      }
      const res = await isPayArticle({
        userId: webUserInfo.id,
        articleId: item._id,
      });
      if (!res.result) {
        confirm({
          title: "Tip",
          icon: <ExclamationCircleFilled />,
          content: `you need to pay $${item.charge} for read this article,confirm payment?`,
          onOk() {
            payArticle({ userId: webUserInfo.id, articleId: item._id }).then(
              () => {
                message.success("Pay Success");
                navigate(`/front/articleDetail?id=${item._id}`);
              }
            );
          },
          onCancel() {},
        });
        return false;
      }
    }
    navigate(`/front/articleDetail?id=${item._id}`);
  };

  const changeClassify = async (id, index) => {
    setClassifyActive(index);
    setHasMore((e) => {
      e = true;
      return e;
    });
    setParams({
      ...params,
      page: 1,
    });
    setCategoryId(id === -1 ? null : id);
    setList([]);
  };

  useEffect(() => {
    getArticleData(true);
  }, [categoryId]);

  const handleOk = () => {
    formRef.current?.submit();
  };

  const onFinish = useCallback(
    (values: any) => {
      setBtnLoad(true);
      values.type = "user";
      login(values)
        .then((res) => {
          const { data, status, token } = res;
          setBtnLoad(false);
          if (status === 1 && !data) return;
          const info: any = Object.assign({ isLogin: true }, res);
          saveWebToken(token);
          message.success("Login Success");
          setUserInfo(info);
          setWebUserInfo(info);
          saveWebUser(info);
          formRef.current?.resetFields();
          setIsModalOpen(false);
        })
        .catch(() => {
          setBtnLoad(false);
        });
    },
    [setUserInfo]
  );

  return (
    <div>
      <div className="top_header"></div>
      <div className="header__Container">
        <img className="logo" src={logo} />
        <div className="classify">
          {classifyData.map((item, index) => {
            return (
              <div
                className="classify_item"
                style={{ color: classifyActive === index ? "red" : "#fff" }}
                key={item._id}
                onClick={() => changeClassify(item._id, index)}
              >
                {item.name}
              </div>
            );
          })}
        </div>
        {webUserInfo ? (
          <div className="right">
            <Dropdown
              placement="bottom"
              getPopupContainer={getPopupContainer}
              dropdownRender={dropdownRender}
            >
              <div>{webUserInfo.name}</div>
            </Dropdown>
          </div>
        ) : (
          <div className="button" onClick={() => setIsModalOpen(true)}>
            Sign In
          </div>
        )}
      </div>
      <div className="content">
        <InfiniteScroll
          dataLength={list.length}
          next={getArticleData}
          hasMore={hasMore}
          endMessage={<Divider plain>You've finished all the news</Divider>}
          loader={
            <Divider plain>
              <Button disabled loading>
                Loading
              </Button>
            </Divider>
          }
        >
          {list.length > 0 ? (
            list.map((item) => (
              <div className="article_item" key={item._id}>
                <div className="left">
                  <div className="title" onClick={() => articleDetail(item)}>
                    {item.title}
                  </div>
                  <div className="desc">{item.desc}</div>
                </div>
                <img
                  className="banner"
                  src={item.banner}
                  alt=""
                  onClick={() => articleDetail(item)}
                />
              </div>
            ))
          ) : (
            <div
              style={{
                fontWeight: "bold",
                textAlign: "center",
                fontSize: "20px",
              }}
            >
              no data
            </div>
          )}
        </InfiniteScroll>
      </div>
      <Modal
        title="Sign In"
        confirmLoading={btnLoad}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form className="login-form" ref={formRef} onFinish={onFinish}>
          <Form.Item name="name" rules={IPT_RULE_USERNAME}>
            <Input
              prefix={<MyIcon type="icon_nickname" />}
              placeholder="please input account"
            />
          </Form.Item>
          <Form.Item name="password" rules={IPT_RULE_PASSWORD}>
            <Input
              prefix={<MyIcon type="icon_locking" />}
              type="password"
              autoComplete="off"
              placeholder="please input password"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

Home.route = {
  [MENU_PATH]: "/front/home",
  [MENU_LAYOUT]: "FULLSCREEN",
};

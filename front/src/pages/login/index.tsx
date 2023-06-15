import { useCallback, useState } from "react";
import { Form, Input, Button, Checkbox, message, Row } from "antd";
import { useDispatch } from "react-redux";
import MyIcon from "@/components/icon";
import { saveUser, getLocalUser, saveToken } from "@/utils";
import { setUserInfoAction } from "@/store/user/action";
import { login } from "@/api";
import { UserInfo } from "@/types"
import "./index.less";
import { useThemeToken } from "@/hooks";



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

function Login() {
  const [btnLoad, setBtnLoad] = useState(false);
  const dispatch = useDispatch()
  const setUserInfo = useCallback((info: UserInfo) => dispatch(setUserInfoAction(info)), [dispatch])
  const token = useThemeToken()
  const onFinish = useCallback((values: any) => {
    setBtnLoad(true);
    login(values)
      .then((res) => {
        const { data, msg, status, token } = res;
        setBtnLoad(false);
        if (status === 1 && !data) return;
        const info = Object.assign({ isLogin: true }, data)
        saveToken(token);
        message.success('Login success!');
        if (values.remember) {
          saveUser(info);
        }
        setUserInfo(info);
      })
      .catch(() => {
        setBtnLoad(false);
      });
  }, [setUserInfo]);
  return (
    <div className="login-container" style={{ backgroundColor: token.colorBgContainer }}>
      <div className="wrapper">
        <div className="title">news admin</div>
        <Form
          className="login-form"
          initialValues={{
            remember: true,
            ...getLocalUser(),
          }}
          onFinish={onFinish}
        >
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
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>
          <Row justify="space-around">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={btnLoad}
            >
              Login
            </Button>
            <Button htmlType="reset">Reset</Button>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default Login;

import { Layout } from "antd";
import Header from "../header";
import Menu from "../siderMenu";
import TopMenu from "../topMenu";
import Router from "@/router";
import { useStyle } from "../style"
const { Content } = Layout;

const SingleColumn = () => {
  const { styles } = useStyle()
  return (
    <Layout className="my-layout-body">
      <Header children={<Menu />} />
      <Layout>
        <Layout className="layout-content-wrap">
          <TopMenu />
          <Content className={styles.layoutContentBody}>
            <Router />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SingleColumn;

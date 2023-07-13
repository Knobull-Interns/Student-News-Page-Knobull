import { Layout } from "antd";
import Header from "../header";
import Menu from "../siderMenu";
import TopMenu from "../topMenu";
import Router from "@/router";
import { useStyle } from "../style";
const { Content } = Layout;

const TwoFlanks = () => {
  const { styles } = useStyle();
  return (
    <Layout className="my-layout-body twoflanks">
      <Menu />
      <Layout className="layout-content-wrap reset-padding">
        <Header children={null} />
        {<TopMenu />}
        <Content className={styles.layoutContentBody}>
          <Router />
        </Content>
      </Layout>
    </Layout>
  );
};

export default TwoFlanks;

// This is the main structure of our React application.

import { Provider } from "react-redux";
import store from "./store";
import AppRouter from "./router/appRouter";
import loadable from "@loadable/component";
import { ConfigProvider } from "antd";
import { useStateThemeToken } from "./store/hooks";
import { useMemo } from "react"; //A React hook that is used to optimize performance by memoizing expensive calculations
const LoadTheme = loadable(() => import("@/components/theme"));

// A Theming Functionality
function Theme() {
  if (__IS_THEME__) {
    return <LoadTheme />;
  }
  return null;
}

function App() {
  return (
    <Provider store={store}>
      <Cfg />
    </Provider>
  );
}

function Cfg() {
  const token = useStateThemeToken();
  const themm = useMemo(() => ({ token }), [token]);
  return (
    <ConfigProvider theme={themm}>
      <AppRouter />
      <Theme />
    </ConfigProvider>
  );
}
export default App;

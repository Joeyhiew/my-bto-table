import { useState } from "react";
import { Typography } from "antd";
import Table from "./components/table";
import { HomeFilled } from "@ant-design/icons";
import { ConfigProvider, theme, Switch } from "antd";
import { ReactComponent as LightSvg } from "./assets/light-mode.svg";
import { ReactComponent as DarkSvg } from "./assets/dark-mode.svg";
import type { GetProps } from "antd";
import Icon from "@ant-design/icons";
import { THEME } from "./constants";
import cx from "classnames";
import "./App.css";

const THEME_STORAGE_KEY = "my_bto_home_light_dark_theme";

type CustomIconComponentProps = GetProps<typeof Icon>;

const LightIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={LightSvg} {...props} />
);

const DarkIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DarkSvg} {...props} />
);

const { Title } = Typography;

function App() {
  // Retrieve stored theme, light theme by default
  const getStoredTheme = () => {
    const isLightTheme = JSON.parse(
      localStorage.getItem(THEME_STORAGE_KEY) ?? "true"
    );
    if (isLightTheme) {
      return THEME.LIGHT;
    }
    return THEME.DARK;
  };

  const [appTheme, setAppTheme] = useState(getStoredTheme());

  // Update stored theme in local storage
  const updateStoredTheme = (checked: boolean) => {
    if (checked) {
      setAppTheme(THEME.LIGHT);
    } else {
      setAppTheme(THEME.DARK);
    }
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(checked));
  };

  return (
    <div className={cx("App", appTheme === THEME.DARK ? "App-dark" : "")}>
      <ConfigProvider
        theme={{
          components: {
            Switch: {
              colorPrimary: "#ffc252",
              colorPrimaryHover: "#ffc252",
              colorTextQuaternary: "#24263d",
              colorTextTertiary: "#24263d",
            },
          },
          algorithm:
            appTheme === THEME.LIGHT
              ? theme.defaultAlgorithm
              : theme.darkAlgorithm,
        }}
      >
        <div
          className={cx("header", appTheme === THEME.DARK ? "header-dark" : "")}
        >
          <Title className="left-margin">My BTO</Title>
          <HomeFilled style={{ fontSize: 24 }} />
          <Switch
            className="last-child"
            checkedChildren={<LightIcon />}
            unCheckedChildren={<DarkIcon />}
            defaultChecked={appTheme === THEME.LIGHT}
            onChange={(val) => updateStoredTheme(val)}
          />
        </div>
        <Table />
      </ConfigProvider>
    </div>
  );
}

export default App;

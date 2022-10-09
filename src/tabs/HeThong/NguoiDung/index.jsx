import "../../../styles/tabs.scss";

import { Tabs } from "antd";
import React, { Fragment, useState } from "react";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";

export default () => {
  const [isShowTransfer, setIsShowTransfer] = useState(false);

  return (
    <Fragment>
      <div className="crud">
        <Tabs
          destroyInactiveTabPane={true}
          defaultActiveKey="1"
          style={{ width: "95%", marginInline: "auto" }}>
          <Tabs.TabPane
            tab={isShowTransfer ? "Phân quyền" : "Danh sách"}
            key="1">
            <UserTable
              isShowTransfer={isShowTransfer}
              setIsShowTransfer={setIsShowTransfer}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Thêm người dùng" key="2">
            <UserForm />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Fragment>
  );
};

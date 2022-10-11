import "../../../styles/tabs.scss";

import { Tabs } from "antd";
import React, { Fragment, useState } from "react";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import formState from "./assets/formState";

export default () => {
  const [isShowTransfer, setIsShowTransfer] = useState(false);
  const [userFormState, setUserFormState] = useState(formState.ADD); // add | edit | detail
  const [userData, setUserData] = useState(null);
  const [currentTab, setCurrentTab] = useState(1);

  const resetFormTab = () => {
    setUserFormState(formState.ADD);
    setCurrentTab(1);
    setUserData(null);
  };

  return (
    <Fragment>
      <div className="crud">
        <Tabs
          destroyInactiveTabPane={true}
          onChange={(value) => {
            setCurrentTab(value);
          }}
          activeKey={currentTab.toString()}
          defaultActiveKey="1"
          style={{ width: "95%", marginInline: "auto" }}>
          <Tabs.TabPane
            tab={isShowTransfer ? "Phân quyền" : "Danh sách"}
            key="1">
            <UserTable
              setUserFormState={setUserFormState}
              setUserData={setUserData}
              isShowTransfer={isShowTransfer}
              setIsShowTransfer={setIsShowTransfer}
              setCurrentTab={setCurrentTab}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              (userFormState === formState.ADD
                ? "Thêm"
                : userFormState === formState.EDIT
                ? "Sửa"
                : "Chi tiết") + " người dùng"
            }
            key="2">
            <UserForm
              userData={userData}
              userFormState={userFormState}
              resetFormTab={resetFormTab}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Fragment>
  );
};

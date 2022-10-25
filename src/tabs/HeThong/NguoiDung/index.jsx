import "../../../styles/tabs.scss";

import { Tabs } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import formState from "./assets/formState";
import { useContext } from "react";
import { TabContext } from "../../../layout/MainLayout";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getDsNguoiDungSvc } from "../../../store/nguoidung/service";
import { RETCODE_SUCCESS, SUCCESS } from "../../../constants/api";
import * as TAB from "../../../constants/tab";
export default () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const isDetail = location.pathname.includes("detail");
  const isEditOrDetail = !!params?.id;

  const [isShowTransfer, setIsShowTransfer] = useState(false);
  const [userFormState, setUserFormState] = useState(formState.ADD); // add | edit | detail
  const [userData, setUserData] = useState(null);
  const [currentTab, setCurrentTab] = useState(1);

  const [listUser, setListUser] = useState([]);
  const [wentToDetail, setWentToDetail] = useState(false);

  const [getListLoading, setGetListLoading] = useState(true);

  const resetFormTab = () => {
    setUserFormState(formState.ADD);
    setCurrentTab(1);
    setUserData(null);
  };

  const handleGetListUser = async () => {
    let _list = [];
    setGetListLoading(true);

    try {
      const res = await getDsNguoiDungSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        const list = res.data?.data
          ?.filter((i) => i?.isDeleted === false)
          ?.map((i) => {
            return {
              maSo: i?.ma_NguoiDung,
              itemName: i?.hoTen,
              key: i?.ma_NguoiDung,
              email: i?.email,
              sdt: i?.sdt,
              gioiTinh: i?.gioiTinh,
              diaChi: i?.diaChi,
              ma_ChucDanh: i?.ma_ChucDanh,
              avatar: i?.avatar,
            };
          });

        setListUser(list);
        _list = list;
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setGetListLoading(false);
    }

    return _list;
  };

  const init = async ({ isDetail = false }) => {
    const list = await handleGetListUser();

    if (isDetail) {
      setCurrentTab(2);
      setUserFormState(formState.DETAIL);
      setUserData(list.find((i) => i?.maSo == params?.id));
    }
  };

  useEffect(() => {
    init({ isDetail });
  }, []);
  return (
    <Fragment>
      <div className="crud">
        <Tabs
          destroyInactiveTabPane={true}
          onChange={(value) => {
            if (value == 1) {
              navigate("/" + TAB.NGUOI_DUNG);
            }
            setCurrentTab(value);
          }}
          activeKey={currentTab.toString()}
          defaultActiveKey="1"
          style={{ width: "95%", marginInline: "auto" }}>
          <Tabs.TabPane
            tab={isShowTransfer ? "Phân quyền" : "Danh sách"}
            key="1">
            <UserTable
              listUser={listUser}
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

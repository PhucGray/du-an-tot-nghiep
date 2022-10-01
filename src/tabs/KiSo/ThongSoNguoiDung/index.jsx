import "../../../styles/tabs.scss";

import { Table, Tabs, Button, Form, Input, message, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  getDsPhongBanSvc,
  sapXepDsPhongBanSvc,
  themPhongBanSvc,
  xoaPhongBanSvc,
} from "../../../store/phongban/service";
import {
  LOI,
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../constants/api";
import { toLowerCaseNonAccentVietnamese } from "../../../utils/strings";
import {
  ArrowLeftOutlined,
  CheckCircleTwoTone,
  HourglassTwoTone,
} from "@ant-design/icons";

export default () => {
  const [getListLoading, setGetListLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [list, setList] = useState([
    {
      maSo: 1,
      hoVaTen: "Nguyen Van A",
      chucDanh: "Tổng giám đốc",
      hetHan: "20-10-2022",
      kiThu: false,
      trangThai: true,
    },
    {
      maSo: 2,
      hoVaTen: "Nguyen Van A",
      chucDanh: "Tổng giám đốc",
      hetHan: "20-10-2022",
      kiThu: true,
      trangThai: false,
    },
  ]);
  const [searchList, setSearchList] = useState([]);

  const columns = [
    {
      title: "Mã số",
      dataIndex: "maSo",
      key: "maSo",
    },
    {
      title: "Họ và tên",
      dataIndex: "hoVaTen",
      key: "hoVaTen",
    },
    {
      title: "Chức danh",
      dataIndex: "chucDanh",
      key: "chucDanh",
    },
    {
      title: "Hết hạn",
      dataIndex: "hetHan",
      key: "hetHan",
    },
    {
      title: "Kí thử",
      dataIndex: "kiThu",
      key: "kiThu",
      render: (_, record) => {
        return (
          <div className="text-center">
            {record?.kiThu ? (
              <CheckCircleTwoTone twoToneColor="#00d447" />
            ) : (
              <HourglassTwoTone />
            )}
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (_, record) => {
        return (
          <div className="text-center">
            {record?.trangThai ? "Đang hiệu lực" : "Không hiệu lực"}
          </div>
        );
      },
    },
    {
      title: "Hành động",
      key: "hanhDong",
      render: (_, record) => (
        <div>
          <div>
            <Button type="link">Sửa</Button>
            <Button type="link">Chi tiết</Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn xoá?"
              // onConfirm={() => handleXoaPhongBan(record)}
              // onCancel={cancel}
              okText="Đồng ý"
              cancelText="Thoát">
              <Button type="link">Xoá</Button>
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div>
        <Table
          loading={getListLoading}
          columns={columns}
          dataSource={keyword.trim() ? searchList : list}
          pagination={{ defaultPageSize: 5 }}
        />
      </div>
    </div>
  );
};

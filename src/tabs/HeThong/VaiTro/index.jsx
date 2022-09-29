import { Space, Table, Tag } from "antd";
import React, { useState } from "react";

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows,
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    // Column configuration not to be checked
    name: record.name,
  }),
};

const columns = [
  // {
  //   title: "Chọn",
  //   dataIndex: "chon",
  //   key: "chon",
  //   render: (text) => <a>{text}</a>,
  // },
  {
    title: "Mã số",
    dataIndex: "ma-so",
    key: "ma-so",
  },
  {
    title: "Tên vai trò",
    dataIndex: "vai-tro",
    key: "vai-tro",
  },
  {
    title: "Phân hệ",
    dataIndex: "phan-he",
    key: "phan-he",
  },
  {
    title: "Ghi chú",
    dataIndex: "ghi-chu",
    key: "ghi-chu",
  },
  // {
  //   title: "Action",
  //   key: "action",
  //   render: (_, record) => (
  //     <Space size="middle">
  //       <a>Invite {record.name}</a>
  //       <a>Delete</a>
  //     </Space>
  //   ),
  // },
];
const data = [
  {
    key: 1,
    "ma-so": "CR016",
    "vai-tro": "Quản lý - Toàn quyền",
    "phan-he": "CRM",
    "ghi-chu": "",
  },
  {
    key: 2,
    "ma-so": "CR017",
    "vai-tro": "Trưởng phòng kinh doanh",
    "phan-he": "CRM",
    "ghi-chu": "",
  },
  {
    key: 3,
    "ma-so": "CR018",
    "vai-tro": "TGD tham khảo",
    "phan-he": "CRM",
    "ghi-chu": "Toàn quyền trên hệ thống",
  },
  {
    key: 4,
    "ma-so": "CR019",
    "vai-tro": "Ban giám đốc",
    "phan-he": "CRM",
    "ghi-chu": "",
  },
];

const VaiTro = () => {
  const [selectionType, setSelectionType] = useState("checkbox");
  return (
    <div>
      <div style={{ width: "95%", marginInline: "auto", marginTop: 20 }}>
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
        />
      </div>
    </div>
  );
};

export default VaiTro;

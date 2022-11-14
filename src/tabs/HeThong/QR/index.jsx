import React, { useState } from "react";
import { Input, Table } from "antd";

const MaQR = () => {
  const [keyword, setKeyword] = useState("");

  const handleSearch = (keyword) => {
    setKeyword(keyword);

    // setSearchList(
    //   [...listUser].filter((i) =>
    //     toLowerCaseNonAccentVietnamese(i?.itemName).includes(
    //       toLowerCaseNonAccentVietnamese(keyword),
    //     ),
    //   ),
    // );
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Mã số",
      dataIndex: "maSo",
      key: "maSo",
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
    },
    {
      title: "Phân loại",
      dataIndex: "phanLoai",
      key: "phanLoai",
    },
    {
      title: "Bảo mật",
      dataIndex: "baoMat",
      key: "baoMat",
    },
  ];

  return (
    <div>
      <div className="px-3 mt-3">
        <div className="mt-2 mb-4 d-flex justify-content-between">
          <Input
            style={{ width: 200 }}
            placeholder="Nhập mã số cần tìm"
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Table
          columns={columns}
          dataSource={[]}
          pagination={{ defaultPageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default MaQR;

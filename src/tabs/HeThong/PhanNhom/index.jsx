import { Button, Transfer } from "antd";
import React, { useEffect, useState } from "react";

const PhanNhom = () => {
  const [mockData, setMockData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

  const groups = [
    {
      id: 1,
      name: "Ban tổng giám đốc",
    },
    {
      id: 2,
      name: "Phòng kinh doanh",
    },
    {
      id: 3,
      name: "Tổ tiếp thị",
    },
    {
      id: 4,
      name: "Phòng nhân sự",
    },
    {
      id: 5,
      name: "Phòng công nghệ thông tin",
    },
    {
      id: 6,
      name: "Chi nhánh An Giang",
    },
  ];

  const getMock = () => {
    const tempTargetKeys = [];
    const tempMockData = [];

    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: i % 2 === 0,
      };

      if (data.chosen) {
        tempTargetKeys.push(data.key);
      }

      tempMockData.push(data);
    }

    setMockData(tempMockData);
    setTargetKeys(tempTargetKeys);
  };

  useEffect(() => {
    getMock();
  }, []);

  const handleChange = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };

  const renderFooter = (_, { direction }) => {
    if (direction === "left") {
      return (
        <Button
          size="small"
          style={{
            float: "left",
            margin: 5,
          }}
          onClick={getMock}>
          Left button reload
        </Button>
      );
    }

    return (
      <Button
        size="small"
        style={{
          float: "right",
          margin: 5,
        }}
        onClick={getMock}>
        Right button reload
      </Button>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <Transfer
        locale={"vi-VN"}
        rowKey={(item) => item.id}
        dataSource={groups}
        showSearch
        listStyle={{
          width: 250,
          height: 300,
          marginTop: 40,
        }}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={(item) => item.name}
        // footer={renderFooter}
      />

      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          gap: 10,
          marginTop: 20,
        }}>
        <Button type="ghost" style={{ width: 150 }} size="large">
          Bỏ qua
        </Button>

        <Button type="primary" style={{ width: 150 }} size="large">
          Đồng ý
        </Button>
      </div>
    </div>
  );
};

export default PhanNhom;

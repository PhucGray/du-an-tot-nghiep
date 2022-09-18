// import "./styles.css";

import { Table, Checkbox, Input, Select } from "antd";
import React, { Fragment, useState } from "react";

const { Search } = Input;
const { Column } = Table;
const { Option } = Select;

const fakeData = [
  {
    key: "1",
    fullName: "Andree Brown",
    index: 1,
    title: "Chuyên viên pháp lý đất",
    expire: "20/10/2022",
    sign: true,
    state: true,
  },
  {
    key: "2",
    fullName: "Dem Green",
    index: 2,
    title: "Nhân viên",
    expire: "1/3/2021",
    sign: false,
    state: true,
  },
  {
    key: "3",
    fullName: "Joe Black",
    index: 3,
    title: "Trưởng phòng",
    expire: "9/9/2020",
    sign: false,
    state: false,
  },
  {
    key: "4",
    fullName: "Beter Red",
    index: 4,
    title: "Bảo vệ",
    expire: "22/12/2022",
    sign: true,
    state: true,
  },
];

const ManageUser = () => {
  const [listUser, setListUser] = useState(fakeData);

  const onSearchByName = (value) => {
    if (!value.trim()) return setListUser(fakeData);
    setListUser(
      [...fakeData].filter((user) =>
        user.fullName.toLowerCase().includes(value?.trim().toLowerCase()),
      ),
    );
  };

  const onFilterState = (state) => {
    switch (state) {
      case "all":
        setListUser(fakeData);
        break;
      case "active":
        setListUser([...fakeData].filter((user) => user.state === true));
        break;
      case "inactive":
        setListUser([...fakeData].filter((user) => user.state === false));
        break;
    }
  };

  return (
    <Fragment>
      <div>
        <div className="d-flex">
          <div>
            <div>Tìm kiếm theo tên</div>
            <Search
              placeholder="Nhập tên"
              size="large"
              onChange={(e) => onSearchByName(e.target.value)}
            />
          </div>

          <div>
            <div>Lọc theo trạng thái</div>
            <Select
              defaultValue="all"
              size="large"
              style={{ width: 160 }}
              onChange={onFilterState}>
              <Option value="all">Tất cả</Option>
              <Option value="active">Đang hiệu lực</Option>
              <Option value="inactive">Không hiệu lực</Option>
            </Select>
          </div>
        </div>
      </div>

      <Table dataSource={listUser} showSorterTooltip={false}>
        <Column
          title="STT"
          dataIndex="index"
          key="index"
          sorter={(a, b) => a.index - b.index}
        />
        <Column
          title="Họ và tên"
          dataIndex="fullName"
          key="fullName"
          sorter={(a, b) => a.fullName.localeCompare(b.fullName)}
        />
        <Column title="Chức vụ" dataIndex="title" key="title" />
        <Column
          title="Ký thử"
          dataIndex="sign"
          key="sign"
          render={(sign) => (
            <Checkbox value={sign} checked={sign} disabled={true} />
          )}
        />

        <Column title="Thời gian hiệu lực" dataIndex="expire" key="expire" />

        <Column
          title="Trạng thái"
          dataIndex="state"
          key="state"
          render={(sign) => (sign ? "Đang hiệu lực" : "Không hiệu lực")}
        />
      </Table>
    </Fragment>
  );
};

export default ManageUser;

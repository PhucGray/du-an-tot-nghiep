import "../../../styles/tabs.scss";

import { Table, Tabs, Button } from "antd";
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  {
    title: "Mã số",
    dataIndex: "maSo",
    key: "maSo",
  },
  {
    title: "Tên vai trò",
    dataIndex: "vaiTro",
    key: "vaiTro",
  },
  {
    title: "Phân hệ",
    dataIndex: "phanHe",
    key: "phanHe",
  },
  {
    title: "Ghi chú",
    dataIndex: "ghiChu",
    key: "ghiChu",
  },
  {
    title: "Hành động",
    key: "hanhDong",
    render: (_, record) => (
      // <Space size="middle">
      //   <a>Invite {record.name}</a>
      //   <a>Delete</a>
      // </Space>
      <div>
        <div>
          <Button type="link">Sửa</Button>
          <Button type="link">Chi tiết</Button>
        </div>
        <div>
          <Button type="link">Xoá</Button>
          <Button type="link">Phân quyền</Button>
        </div>
      </div>
    ),
  },
];

const titles = [
  {
    id: 11,
    name: "Tổng giám đốc",
    order: 1,
  },
  {
    id: 12,
    name: "Giám đốc chi nhánh",
    order: 2,
  },
  {
    id: 13,
    name: "Giám đốc",
    order: 3,
  },
  {
    id: 14,
    name: "Trưởng phòng",
    order: 4,
  },
  {
    id: 15,
    name: "Phó phòng",
    order: 5,
  },
];

const mockData = [
  {
    id: 1,
    maSo: "CR016",
    vaiTro: "Quản lý - Toàn quyền",
    phanHe: "CRM",
    ghiChu: "",
  },
  {
    id: 2,
    maSo: "CR017",
    vaiTro: "Trưởng phòng kinh doanh",
    phanHe: "CRM",
    ghiChu: "",
  },
  {
    id: 3,
    maSo: "CR018",
    vaiTro: "TGD tham khảo",
    phanHe: "CRM",
    ghiChu: "",
  },
  {
    id: 4,
    maSo: "CR019",
    vaiTro: "Nhân sự",
    phanHe: "CRM",
    ghiChu: "",
  },
];

const VaiTro = () => {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [list, setList] = useState(mockData);

  function onDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setList(items);
  }

  const data = mockData.map((i) => {
    return { ...i, key: i.id };
  });

  return (
    <div className="vai-tro">
      <Tabs defaultActiveKey="1" style={{ width: "95%", marginInline: "auto" }}>
        <Tabs.TabPane tab="Danh sách" key="1">
          <div style={{}}>
            <Table
              rowSelection={{
                type: selectionType,
                ...rowSelection,
              }}
              columns={columns}
              dataSource={data}
            />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Sắp xếp" key="2">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="listTitle">
              {(provided) => (
                <div
                  className="c-table"
                  {...provided.droppableProps}
                  ref={provided.innerRef}>
                  <div className="c-row">
                    <div className="c-data">STT</div>
                    <div className="flex-grow-1">Tiêu đề</div>
                    <div className="c-data">Id</div>
                    <div className="c-data">Order</div>
                  </div>
                  {list.map(({ id, vaiTro }, index) => {
                    return (
                      <Draggable
                        key={id}
                        draggableId={id.toString()}
                        index={index}>
                        {(provided) => (
                          <div
                            className={`c-row ${
                              index % 2 === 0 && "c-row-even"
                            }`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <div className="c-data">{index + 1}</div>
                            <div className="flex-grow-1">{vaiTro}</div>
                            <div className="c-data">{id}</div>
                            <div className="c-data">{index + 1}</div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default VaiTro;

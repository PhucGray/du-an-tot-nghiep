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
    title: "Tên viết tắt",
    dataIndex: "tenVietTat",
    key: "tenVietTat",
  },
  {
    title: "Tên nhóm",
    dataIndex: "tenNhom",
    key: "tenNhom",
  },
  {
    title: "Hành động",
    key: "hanhDong",
    render: (_, record) => (
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
    maSo: "GP016",
    tenVietTat: "Quản lý - Toàn quyền",
    tenNhom: "CRM",
  },
  {
    id: 2,
    maSo: "GP017",
    tenVietTat: "Trưởng phòng kinh doanh",
    tenNhom: "CRM",
  },
  {
    id: 3,
    maSo: "GP018",
    tenVietTat: "TGD tham khảo",
    tenNhom: "CRM",
  },
  {
    id: 4,
    maSo: "GP019",
    tenVietTat: "Nhân sự",
    tenNhom: "CRM",
  },
];

export default () => {
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
                    <div className="c-data">Mã số</div>
                    <div className="flex-grow-1">Tên nhóm</div>
                    <div className="c-data">Order</div>
                  </div>
                  {list.map(({ id, maSo, tenVietTat, tenNhom }, index) => {
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
                            <div className="c-data">{maSo}</div>
                            <div className="flex-grow-1">{tenVietTat}</div>
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

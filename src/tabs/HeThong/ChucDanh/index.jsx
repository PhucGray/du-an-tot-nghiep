import "../../../styles/tabs.scss";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "antd";

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

function ChucDanh() {
  const [listTitle, setListTitle] = useState(titles);

  function onDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(listTitle);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setListTitle(items);
  }

  return (
    <div className="chuc-danh">
      <div className="sign-steps-container">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="listTitle">
            {(provided) => (
              <div
                className="c-table"
                {...provided.droppableProps}
                ref={provided.innerRef}>
                <div className="c-row">
                  <div className="c-stt">STT</div>
                  <div className="c-name">Tiêu đề</div>
                  <div className="c-id">Id</div>
                  <div className="c-order">Order</div>
                </div>
                {listTitle.map(({ id, name, order }, index) => {
                  return (
                    <Draggable
                      key={id}
                      draggableId={id.toString()}
                      index={index}>
                      {(provided) => (
                        <div
                          className={`c-row ${index % 2 === 0 && "c-row-even"}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                          <div className="c-stt">{index + 1}</div>
                          <div className="c-name">{name}</div>
                          <div className="c-id">{id}</div>
                          <div className="c-order">{index + 1}</div>
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
      </div>

      <Button type="primary" className="mx-auto mt-4 w-25 d-block" size="large">
        Lưu
      </Button>
    </div>
  );
}

export default ChucDanh;

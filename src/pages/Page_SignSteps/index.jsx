import "./styles.css";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const titles = [
  {
    id: 11,
    name: "Son",
    order: 1,
  },
  {
    id: 12,
    name: "Chien",
    order: 2,
  },
  {
    id: 13,
    name: "Duy",
    order: 3,
  },
  {
    id: 14,
    name: "Vi",
    order: 4,
  },
  {
    id: 15,
    name: "Phucs",
    order: 5,
  },
];

function App() {
  const [listTitle, setListTitle] = useState(titles);

  function onDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(listTitle);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setListTitle(items);
  }

  console.log(listTitle);

  return (
    <div className="">
      <div className="">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="listTitle">
            {(provided) => (
              <div
                className="c-table"
                {...provided.droppableProps}
                ref={provided.innerRef}>
                <div className="c-row">
                  <div className="c-stt">STT</div>
                  <div className="c-name">Ten chuc vu</div>
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
                          className="c-row"
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
    </div>
  );
}

export default App;

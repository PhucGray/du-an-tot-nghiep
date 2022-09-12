import "./styles.css";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const titles = [
  {
    id: 11,
    name: "Gary Goodspeed",
  },
  {
    id: 12,
    name: "Little Cato",
  },
  {
    id: 13,
    name: "KVN",
  },
  {
    id: 14,
    name: "Mooncake",
  },
  {
    id: 15,
    name: "Quinn Ergon",
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
                </div>
                {listTitle.map(({ id, name }, index) => {
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

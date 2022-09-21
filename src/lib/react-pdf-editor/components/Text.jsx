import React, { RefObject, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { TEXT_MODE } from "../entities";

// interface Props {
//   inputRef: RefObject<HTMLInputElement>;
//   text?: string;
//   mode: string;
//   width: number;
//   size?: number;
//   height: number;
//   lineHeight?: number;
//   fontFamily?: string;
//   positionTop: number;
//   positionLeft: number;
//   toggleEditMode: () => void;
//   handleMouseDown: DragEventListener<HTMLDivElement>;
//   handleMouseUp: DragEventListener<HTMLDivElement>;
//   handleMouseMove: DragEventListener<HTMLDivElement>;
//   handleMouseOut: DragEventListener<HTMLDivElement>;
//   onChangeText: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

export const Text = ({
  text,
  width,
  height,
  inputRef,
  mode,
  size,
  fontFamily,
  positionTop,
  positionLeft,
  onChangeText,
  toggleEditMode,
  handleMouseDown,
  handleMouseMove,
  handleMouseOut,
  handleMouseUp,
  lineHeight,
  setWidth,
}) => {
  useEffect(() => {
    setWidth(text?.length * 10 + 50);
  }, [text]);

  return (
    <>
      <div
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        // onDoubleClick={toggleEditMode}
        style={{
          width,
          border: 1,
          height,
          fontFamily,
          fontSize: size,
          lineHeight,
          cursor: mode === TEXT_MODE.COMMAND ? "move" : "default",
          top: positionTop,
          left: positionLeft,
          borderColor: "gray",
          borderStyle: "solid",
          // wordWrap: "break-word",
          position: "absolute",
        }}>
        <input
          onClick={toggleEditMode}
          type="text"
          ref={inputRef}
          onChange={(e) => {
            onChangeText(e);
          }}
          readOnly={mode === TEXT_MODE.COMMAND}
          style={{
            width: "100%",
            borderStyle: "none",
            borderWidth: 0,
            fontFamily,
            fontSize: size,
            outline: "none",
            padding: 0,
            // boxSizing: "border-box",
            lineHeight,
            height,
            margin: 0,
            backgroundColor: "transparent",
            cursor: mode === TEXT_MODE.COMMAND ? "move" : "text",
          }}
          value={text}
        />
      </div>
    </>
  );
};

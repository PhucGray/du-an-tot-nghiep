import React, { useState, useRef } from "react";
import { Text as Component } from "../components/Text";
import { getMovePosition } from "../utils/helpers";
import { DRAG_ACTIONS, TEXT_MODE } from "../entities";
import Draggable from "react-draggable";

// interface Props {
//   pageWidth: number;
//   pageHeight: number;
//   updateTextAttachment: (textObject: Partial<TextAttachment>) => void;
// }

export const Text = ({
  x,
  y,
  text,
  width: defaultWidth,
  height,
  lineHeight,
  size,
  fontFamily,
  pageHeight,
  pageWidth,
  updateTextAttachment,
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const inputRef = useRef();
  const [content, setContent] = useState(text || "");
  const [mouseDown, setMouseDown] = useState(false);
  const [positionTop, setPositionTop] = useState(y);
  const [positionLeft, setPositionLeft] = useState(x);
  const [dragActions, setDragActions] = useState(DRAG_ACTIONS.NO_MOVEMENT);
  const [textMode, setTextMode] = useState(TEXT_MODE.COMMAND);

  const handleMouseMove = (event) => {
    event.preventDefault();

    if (mouseDown) {
      const { top, left } = getMovePosition(
        positionLeft,
        positionTop,
        event.movementX,
        event.movementY,
        width,
        height,
        pageWidth,
        pageHeight,
      );

      setPositionTop(top);
      setPositionLeft(left);
    }
  };

  const handleMousedown = (event) => {
    if (textMode !== TEXT_MODE.COMMAND) {
      return;
    }

    setMouseDown(true);
    setDragActions(DRAG_ACTIONS.MOVE);
  };

  const handleMouseUp = (event) => {
    event.preventDefault();

    if (textMode !== TEXT_MODE.COMMAND) {
      return;
    }

    setMouseDown(false);

    if (dragActions === DRAG_ACTIONS.MOVE) {
      const { top, left } = getMovePosition(
        positionLeft,
        positionTop,
        event.movementX,
        event.movementY,
        width,
        height,
        pageWidth,
        pageHeight,
      );

      updateTextAttachment({
        x: left,
        y: top,
      });
    }

    setDragActions(DRAG_ACTIONS.NO_MOVEMENT);
  };

  const handleMouseOut = (event) => {
    if (dragActions === DRAG_ACTIONS.MOVE) {
      handleMouseUp(event);
    }

    if (textMode === TEXT_MODE.INSERT) {
      // setTextMode(TEXT_MODE.COMMAND);
      // prepareTextAndUpdate();
    }
  };

  const prepareTextAndUpdate = () => {
    // Deselect any selection when returning to command mode
    document.getSelection()?.removeAllRanges();

    const lines = [content];
    updateTextAttachment({
      lines,
      text: content,
    });
  };

  const toggleEditMode = () => {
    const input = inputRef.current;
    const mode =
      textMode === TEXT_MODE.COMMAND ? TEXT_MODE.INSERT : TEXT_MODE.COMMAND;

    setTextMode(mode);

    if (input && mode === TEXT_MODE.INSERT) {
      input.focus();
      input.select();
    } else {
      prepareTextAndUpdate();
    }
  };

  const onChangeText = (event) => {
    const value = event.currentTarget.value;
    setContent(value);
  };

  // const [pos, setPos] = useState({
  //   x: 0,
  //   y: 0,
  // });

  return (
    <>
      <Component
        text={content}
        width={width}
        height={height}
        mode={textMode}
        size={size}
        lineHeight={lineHeight}
        inputRef={inputRef}
        fontFamily={fontFamily}
        positionTop={positionTop}
        onChangeText={onChangeText}
        positionLeft={positionLeft}
        handleMouseUp={handleMouseUp}
        toggleEditMode={toggleEditMode}
        handleMouseOut={handleMouseOut}
        handleMouseDown={handleMousedown}
        handleMouseMove={handleMouseMove}
        setWidth={setWidth}
      />
      {/* <Component
        text={content}
        width={width}
        height={height}
        mode={textMode}
        size={size}
        lineHeight={lineHeight}
        inputRef={inputRef}
        fontFamily={fontFamily}
        positionTop={positionTop}
        onChangeText={onChangeText}
        positionLeft={positionLeft}
        handleMouseUp={handleMouseUp}
        toggleEditMode={toggleEditMode}
        handleMouseOut={handleMouseOut}
        handleMouseDown={handleMousedown}
        handleMouseMove={handleMouseMove}
        handleDrag={handleDrag}
        handleDragStart={handleDragStart}
        handleDragEnd={handleDragEnd}
      /> */}
    </>
  );
};

// <Component
//   text={content}
//   width={width}
//   height={height}
//   mode={textMode}
//   size={size}
//   lineHeight={lineHeight}
//   inputRef={inputRef}
//   fontFamily={fontFamily}
//   positionTop={positionTop}
//   onChangeText={onChangeText}
//   positionLeft={positionLeft}
//   handleMouseUp={handleMouseUp}
//   toggleEditMode={toggleEditMode}
//   handleMouseOut={handleMouseOut}
//   handleMouseDown={handleMousedown}
//   handleMouseMove={handleMouseMove}
//   handleDrag={handleDrag}
//   handleDragStart={handleDragStart}
//   handleDragEnd={handleDragEnd}
// />;

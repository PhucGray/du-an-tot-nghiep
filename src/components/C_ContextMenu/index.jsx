import React, { useState } from "react";
import { Rect, Text } from "react-konva";
import { Portal } from "react-konva-utils";

const ContentMenu = ({ contextMenuData, onSelectMenuOption }) => {
  const [option1Hover, setOption1Hover] = useState(false);
  const [option2Hover, setOption2Hover] = useState(false);
  return (
    <Portal>
      <Rect
        onClick={(e) => {
          e.evt.preventDefault();
          e.evt.stopPropagation();
          onSelectMenuOption("edit");
        }}
        x={contextMenuData?.position?.x || 0}
        y={contextMenuData?.position?.y || 0}
        height={30}
        width={150}
        fill={option1Hover ? "#d6d6d6" : "#fff"}
        onMouseEnter={() => {
          document.body.style.cursor = "pointer";
          setOption1Hover(true);
          setOption2Hover(false);
        }}
        onMouseLeave={() => {
          document.body.style.cursor = "default";
          setOption1Hover(false);
        }}
      />
      <Text
        onMouseEnter={() => {
          document.body.style.cursor = "pointer";
          setOption1Hover(true);
        }}
        onMouseLeave={() => {
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.evt.preventDefault();
          e.evt.stopPropagation();
          onSelectMenuOption("edit");
        }}
        text="Sửa"
        x={contextMenuData?.position?.x + 10 || 10}
        y={contextMenuData?.position?.y + 8 || 8}
        height={30}
      />
      <Rect
        onContextMenu={() => console.log("rect")}
        onClick={(e) => {
          e.evt.preventDefault();
          e.evt.stopPropagation();
          onSelectMenuOption("delete");
        }}
        x={contextMenuData?.position?.x || 0}
        y={contextMenuData?.position?.y + 30 || 30}
        height={30}
        width={150}
        fill={option2Hover ? "#d6d6d6" : "#fff"}
        onMouseEnter={() => {
          document.body.style.cursor = "pointer";
          setOption2Hover(true);
          setOption1Hover(false);
        }}
        onMouseLeave={() => {
          document.body.style.cursor = "default";
          setOption2Hover(false);
        }}
      />
      <Text
        onMouseEnter={() => {
          document.body.style.cursor = "pointer";
          setOption2Hover(true);
        }}
        onMouseLeave={() => {
          document.body.style.cursor = "default";
        }}
        onContextMenu={() => console.log("text")}
        onClick={(e) => {
          e.evt.preventDefault();
          e.evt.stopPropagation();
          onSelectMenuOption("delete");
        }}
        text="Xoá"
        height={30}
        x={contextMenuData?.position?.x + 10 || 10}
        y={contextMenuData?.position?.y + 38 || 38}
      />
    </Portal>
  );
};

export default ContentMenu;

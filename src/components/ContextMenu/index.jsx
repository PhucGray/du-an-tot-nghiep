import "./styles.scss";

import React from "react";

const ContextMenu = ({ x = 0, y = 0, onSelectMenuOption = () => {} }) => {
  return (
    <div
      className="context-menu"
      style={{
        left: x,
        top: y,
      }}>
      <div
        className="context-menu-option"
        onClick={() => onSelectMenuOption("edit")}>
        Sửa
      </div>
      <div
        className="context-menu-option"
        onClick={() => onSelectMenuOption("delete")}>
        Xoá
      </div>
    </div>
  );
};

export default ContextMenu;

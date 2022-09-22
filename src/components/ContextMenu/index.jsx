import "./styles.scss";

import React from "react";

const ContextMenu = ({ x = 0, y = 0, onSelectMenuOption = () => {} }) => {
  return (
    <div style={{ zIndex: 999, position: "absolute", top: 0, left: 0 }}>
      <div>Hekk</div>
    </div>
    // <div
    //   className="context-menu"
    //   style={{
    //     // left: x,
    //     // top: y,
    //     left: 0,
    //     top: 0,
    //   }}>
    //   <div
    //     className="context-menu-option"
    //     onClick={() => onSelectMenuOption("edit")}>
    //     Sửa
    //   </div>
    //   <div
    //     className="context-menu-option"
    //     onClick={() => onSelectMenuOption("delete")}>
    //     Xoá
    //   </div>
    // </div>
  );
};

export default ContextMenu;

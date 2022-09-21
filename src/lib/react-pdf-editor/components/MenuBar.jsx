import React, { Fragment } from "react";
import { Menu, Dropdown, Icon } from "semantic-ui-react";

// interface Props {
//   openHelp: () => void;
//   uploadNewPdf: () => void;
//   addText: () => void;
//   addImage: () => void;
//   addDrawing: () => void;
//   isPdfLoaded: boolean;
//   savingPdfStatus: boolean;
//   savePdf: () => void;
// }

export default ({
  openHelp,
  uploadNewPdf,
  addDrawing,
  addText,
  addImage,
  isPdfLoaded,
  savingPdfStatus,
  savePdf,
}) => (
  <Menu pointing>
    <Menu.Item header>Ký thử</Menu.Item>
    <Menu.Menu position="right">
      {isPdfLoaded && (
        <Fragment>
          <Dropdown
            data-testid="edit-menu-dropdown"
            item
            closeOnBlur
            icon="edit outline"
            simple>
            <Dropdown.Menu>
              <Dropdown.Item onClick={addText}>Thêm chữ</Dropdown.Item>
              <Dropdown.Item onClick={addImage}>Thêm ảnh</Dropdown.Item>
              {/* <Dropdown.Item onClick={addDrawing}>Add Drawing</Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item
            data-testid="save-menu-item"
            name={savingPdfStatus ? "Đang lưu..." : "Lưu"}
            disabled={savingPdfStatus}
            onClick={savePdf}
          />
          <Menu.Item
            data-testid="upload-menu-item"
            name="Tạo file pdf mới"
            onClick={uploadNewPdf}
          />
        </Fragment>
      )}
      {/* <Menu.Item data-testid="help-menu-item" onClick={openHelp}>
        <Icon name="question circle outline" />
      </Menu.Item> */}
    </Menu.Menu>
  </Menu>
);

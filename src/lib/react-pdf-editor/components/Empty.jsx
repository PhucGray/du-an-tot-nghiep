import { Button } from "antd";
import React from "react";
import { Segment, Header, Icon } from "semantic-ui-react";
import { FilePdfOutlined } from "@ant-design/icons";

// interface Props {
//   loading: boolean;
//   uploadPdf: () => void;
// }

export default ({ loading, uploadPdf }) => (
  <div
    className="d-flex flex-column align-items-center py-5 border rounded mx-auto mt-3"
    style={{ width: "90%" }}
    // data-testid="empty-container"
    // placeholder
    // loading={loading}
    // style={{ height: "80vh" }}
  >
    {/* <Header icon>
      <Icon name="file pdf outline" />
      Tải lên file pdf của bạn để bắt đầu chỉnh sửa
    </Header> */}
    <div>
      <FilePdfOutlined style={{ fontSize: 50 }} />
    </div>

    <div className="mt-3">
      <Button
        type="primary"
        className="rounded"
        data-testid="empty-screen-upload-pdf-btn"
        onClick={uploadPdf}>
        Tải PDF
      </Button>
    </div>
  </div>
);

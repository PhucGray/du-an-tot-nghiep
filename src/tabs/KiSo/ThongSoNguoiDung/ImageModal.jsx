import { Button } from "antd";
import React from "react";
import { CloudUploadOutlined } from "@ant-design/icons";
import { API_DOMAIN } from "../../../configs/api";

const ImageModal = ({
  number = 1,
  required = false,
  onClick = () => {},
  error = "",
  image = null,
  loading = false,
}) => {
  return (
    <div>
      <div className="ant-form-item">
        <div className="ant-row ant-form-item-row">
          <div className="ant-col ant-col-5 ant-form-item-label">
            <label
              for="suathongso_passCode"
              className={required ? "ant-form-item-required" : undefined}
              title="Passcode">
              Hình {number}
            </label>
          </div>
        </div>
      </div>

      {image && (
        <div className="d-flex justify-content-center mt-2">
          <img src={image} />
        </div>
      )}

      <div className="d-flex justify-content-center mt-2">
        <Button
          loading={loading}
          onClick={onClick}
          icon={<CloudUploadOutlined />}>
          Chọn ảnh
        </Button>
      </div>

      {error && (
        <div className="ant-form-item-explain-error text-center">{error}!</div>
      )}

      {/* <div className="d-flex flex-column align-items-center gap-3">
        <div
          style={{
            height: 250,
            width: 250,
            backgroundColor: "red",
          }}></div>
      </div> */}
    </div>
  );
};

export default ImageModal;

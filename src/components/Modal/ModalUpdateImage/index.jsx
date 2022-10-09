import "./style.css";

import React, { useState, useRef } from "react";
import { Button, Slider } from "antd";
import AvatarEditor from "react-avatar-editor";
import { uploadBlobToStorage } from "../../../utils/images";
import { height } from "../../../constants/dimension";

const ModalUpdateImage = ({
  onClose = () => {},
  image = null,
  setUrl = () => {},
}) => {
  const avatarEditorRef = useRef();

  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);

  const onUploadClick = async () => {
    if (avatarEditorRef) {
      setUpdateLoading(true);
      const base64 = avatarEditorRef.current.getImage()?.toDataURL();

      const result = await fetch(base64);
      const blob = await result.blob();
      const url = await uploadBlobToStorage(blob);

      setUrl(url);
      setUpdateLoading(false);
      onClose();
    }
  };

  return (
    <div className="c-modal-container" onClick={onClose}>
      <div
        className="c-modal-main"
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <div className="c-modal-title">Thay đổi ảnh đại diện</div>
        <AvatarEditor
          ref={avatarEditorRef}
          image={image?.data}
          width={height * 0.8 * 0.3}
          height={height * 0.8 * 0.3}
          border={50}
          scale={scale}
          rotate={rotation}
        />

        <div className="w-100">
          <div className="modal-tools">
            <div className="modal-tool">
              <div className="modal-tool-label">Thu/phóng:</div>
              <Slider
                value={scale}
                onChange={(value) => setScale(value)}
                min={0}
                max={5}
                step={0.1}
                defaultValue={1}
                className="modal-tool-item"
              />
            </div>

            <div className="modal-tool">
              <div className="modal-tool-label">Xoay:</div>
              <Slider
                value={rotation}
                onChange={(value) => setRotation(value)}
                min={0}
                max={360}
                step={5}
                defaultValue={0}
                className="modal-tool-item"
              />
            </div>
          </div>

          <div className="modal-buttons">
            <Button
              onClick={onClose}
              type="ghost"
              size="large"
              className="c-modal-btn">
              Thoát
            </Button>
            <Button
              loading={updateLoading}
              type="primary"
              size="large"
              className="c-modal-btn"
              onClick={onUploadClick}>
              Thay đổi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUpdateImage;

import "./styles.css";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button, Slider } from "antd";

const ModalUpdateImage = ({ visible = false, onClose = () => {} }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels);
  }, []);

  if (!visible) return null;

  return (
    <div className="modal-container" onClick={onClose}>
      <div
        className="modal-main"
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <div className="crop-container">
          <Cropper
            image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="round"
            style={{}}
          />
        </div>

        <div className="modal-bottom">
          <div className="tools">
            <div className="tool">
              <div className="tool-label">Scale:</div>
              <Slider
                value={zoom}
                onChange={(value) => setZoom(value)}
                min={0}
                max={3}
                step={0.1}
                defaultValue={1}
                className="tool-item"
              />
            </div>

            <div className="tool">
              <div className="tool-label">Rotate:</div>
              <Slider
                value={rotation}
                onChange={(value) => setRotation(value)}
                min={0}
                max={360}
                step={5}
                defaultValue={0}
                className="tool-item"
              />
            </div>
          </div>

          <div className="buttons">
            <Button
              onClick={onClose}
              type="ghost"
              size="large"
              className="c-btn">
              Thoát
            </Button>
            <Button type="primary" size="large" className="c-btn">
              Thay đổi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUpdateImage;

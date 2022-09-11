import "./styles.css";

import React, { useState } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import SignImage from "../../components/SignImage";
import HopDongMau from "../../assets/images/hop-dong-mau.png";
import * as Images from "../../assets/images";
import { Select, Button, Input, Pagination } from "antd";
import * as Icon from "../../assets/icons";
import { width, height } from "../../constants/dimension";

const { TextArea } = Input;
const { Option } = Select;

const images = [
  {
    id: 1,
    url: Images.CK_1,
    name: "chu ky 1",
  },
  {
    id: 2,
    url: Images.CK_2,
    name: "chu ky 2",
  },
  {
    id: 3,
    url: Images.CK_3,
    name: "chu ky 3",
  },
  {
    id: 4,
    url: Images.CK_4,
    name: "chu ky 4",
  },
];

const TrySign = () => {
  const paperWidth = width * 0.5;
  const paperHeight = (paperWidth * 842) / 595;

  const [img] = useImage(HopDongMau);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const onWrapperCancel = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();

    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const onBackgroundCancel = () => setSelectedId(null);

  const handleSelectedImgChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <div style={{ minHeight: height, paddingBottom: 80 }}>
      <div className="title">Ký thử</div>

      <div className="d-flex justify-content-center mt-3">
        <div>
          <div className="d-flex">
            <div className="label">Thêm hình:</div>
            <Select
              defaultValue="--------"
              style={{ width: 230 }}
              onChange={handleSelectedImgChange}>
              {images.map((image) => (
                <Option key={image.id} value={image.id}>
                  {image.name}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <div className="d-flex mt-2">
              <div className="label">Thêm nội dung:</div>

              <TextArea
                showCount
                maxLength={150}
                style={{ height: 100, width: 230 }}

                // onChange={onChange}
              />
            </div>

            <Button style={{ marginLeft: 130 }}>Thêm nội dung</Button>
          </div>
        </div>

        <div className="ms-5">
          <div className="d-flex">
            <Button
              className="d-flex align-items-center gap-1"
              icon={Icon.reset}>
              Làm mới
            </Button>

            <Button
              className="d-flex align-items-center gap-1 ms-1"
              icon={Icon.sign}>
              Ký số
            </Button>

            <Button
              className="d-flex align-items-center gap-1 ms-1"
              icon={Icon.back}>
              Quay lại
            </Button>
          </div>

          <div className="mt-2">
            <div>File kết quả: </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Pagination
          current={currentPage}
          style={{ marginInline: "auto", width: "fit-content" }}
          total={4}
          pageSize={1}
          onChange={(page) => setCurrentPage(page)}
          showTotal={(total) => `Trang: ${currentPage}/${total}`}
          showQuickJumper
        />
      </div>

      <div
        className="mt-5 mx-auto"
        style={{
          width: paperWidth,
          height: paperHeight,
          boxShadow: "0 0 0 1px #2435ce",
        }}>
        <Stage
          onMouseDown={onWrapperCancel}
          onTouchStart={onWrapperCancel}
          width={paperWidth}
          height={paperHeight}
          style={{
            height: paperHeight,
            width: paperWidth,
          }}>
          <Layer>
            <KonvaImage
              onMouseDown={onBackgroundCancel}
              onClick={onBackgroundCancel}
              onTouchStart={onBackgroundCancel}
              image={img}
              width={paperWidth}
              height={paperHeight}
              x={0}
              y={0}
            />

            {images.map((image) => (
              <SignImage
                key={image.id}
                url={image.url}
                isSelected={image.id === selectedId}
                onClick={() => setSelectedId(image.id)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default TrySign;

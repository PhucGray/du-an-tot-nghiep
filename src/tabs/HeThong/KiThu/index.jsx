import React, { useEffect, useState } from "react";

import { Image as KonvaImage, Layer, Stage, Text } from "react-konva";
import { Pagination } from "semantic-ui-react";
import { Select, Input, message, Button } from "antd";
import useImage from "use-image";
import Empty from "../../../lib/react-pdf-editor/components/Empty";
import Page from "../../../lib/react-pdf-editor/components/Page";
import useAttachments from "../../../lib/react-pdf-editor/hooks/useAttachments";
import usePdf from "../../../lib/react-pdf-editor/hooks/usePdf";
import useUploader, {
  UploadTypes,
} from "../../../lib/react-pdf-editor/hooks/useUploader";
import axios from "axios";
import { API_DOMAIN, API_URL } from "../../../configs/api";
import {
  SUCCESS,
  RETCODE_SUCCESS,
  LOI,
  LOI_HE_THONG,
} from "../../../constants/api";
import useUploadFileToFireBase from "../../../hooks/useUploadFileToFireBase";
import ContextMenu from "../../../components/ContextMenu";
import { useParams } from "react-router-dom";
import { getThongSoNguoiDungSvc } from "../../../store/kyso_thongso/services";
import { kyThuSvc } from "../../../store/kyso/services";

const { Option } = Select;
const { TextArea } = Input;

const LionImage = ({ onDragEnd, onChangePos, ...props }) => {
  const [image] = useImage(props?.src);
  return (
    <KonvaImage
      onDragEnd={(e) => {
        const offset = { x: e.target.attrs.x, y: e.target.attrs.y };
        const { x, y } = offset;
        const { width, height } = e.currentTarget.getSize();
        onDragEnd(e);
        onChangePos({ x, y, id: props?.id, width, height });
      }}
      {...props}
      image={image}
    />
  );
};

const LionText = ({ onDragEnd, onChangePos, ...props }) => {
  return (
    <Text
      onDragEnd={(e) => {
        const offset = { x: e.target.attrs.x, y: e.target.attrs.y };
        const { x, y } = offset;
        const { width, height } = e.currentTarget.getSize();
        onDragEnd(e);
        onChangePos({ x, y, id: props?.id, width, height });
      }}
      {...props}
      fontSize={14}
    />
  );
};

const KiThu = () => {
  const params = useParams();

  const signs = [
    {
      id: 1,
      value:
        "https://firebasestorage.googleapis.com/v0/b/tot-nghiep-csharp.appspot.com/o/ck1.png?alt=media&token=a7200610-5600-43cd-a14c-a43fe17ce612",
      text: "chuky1.png",
    },
    {
      id: 2,
      value:
        "https://firebasestorage.googleapis.com/v0/b/tot-nghiep-csharp.appspot.com/o/ck2.png?alt=media&token=263c4d5d-72db-40f6-8603-0008226e1ee8",
      text: "chuky2.png",
    },
    {
      id: 3,
      value:
        "https://firebasestorage.googleapis.com/v0/b/tot-nghiep-csharp.appspot.com/o/ck3.png?alt=media&token=80ebc8e0-49ae-4677-932d-91a336ad3637",
      text: "chuky3.png",
    },
    {
      id: 4,
      value:
        "https://firebasestorage.googleapis.com/v0/b/tot-nghiep-csharp.appspot.com/o/ck4.png?alt=media&token=568c3b1b-88ec-49b5-afb9-6ed067512bff",
      text: "chuky4.png",
    },
  ];

  const [nguoiDungKi, setNguoiDungKi] = useState(null);

  const [pdfSizes, setPdfSizes] = useState([]);
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });
  const [texts, setTexts] = useState([]);
  const [resFile, setResFile] = useState(null);

  const [images, setImages] = useState([]);
  const [contextMenuData, setContextMenuData] = useState(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [textarea, setTextarea] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [xuatLoading, setXuatLoading] = useState(false);

  const initializePageAndAttachments = (pdfDetails) => {
    initialize(pdfDetails);
    const numberOfPages = pdfDetails.pages.length;
    resetAttachments(numberOfPages);
  };

  const {
    inputRef: pdfInput,
    handleClick: handlePdfClick,
    isUploading,
    onClick,
    upload: uploadPdf,
    file: pdfFile,
  } = useUploader({
    use: UploadTypes.PDF,
    afterUploadPdf: initializePageAndAttachments,
  });

  const {
    file,
    initialize,
    pageIndex,
    isMultiPage,
    isFirstPage,
    isLastPage,
    currentPage,
    isSaving,
    savePdf,
    previousPage,
    nextPage,
    setDimensions,
    name,
    dimensions,
    totalPages,
    setActivePage,
    pages,
  } = usePdf();

  const {
    add: addAttachment,
    allPageAttachments,
    pageAttachments,
    reset: resetAttachments,
  } = useAttachments();

  const {
    percent,
    uploading,
    uploadFile: uploadToFireBase,
    url,
  } = useUploadFileToFireBase({ file: pdfFile });

  const {
    inputRef: imageInputRef,
    onClick: onImageInputClick,
    upload: onImageInputChange,
  } = useUploader({
    use: UploadTypes.IMAGE,
    afterUploadAttachment: addAttachment,
  });

  const handleSignChange = (value, option) => {
    const key = option?.key;

    if (key) {
      setImages([
        ...images,
        {
          ...option,
          id: key?.toString(),
          x: 0,
          y: 0,
          isDragging: false,
          src: option?.value,
          pageIndex,
        },
      ]);
    }
  };

  const handleContextMenu = (e, data, type) => {
    e.evt.preventDefault(true);

    const mousePosition = e.target.getStage().getPointerPosition();
    setContextMenuData({ position: mousePosition, data, type });
  };

  const handleDeleteImage = (id) => {
    setImages([...images].filter((image) => image.id != id));
  };

  const handleAddText = () => {
    setTexts([
      ...texts,
      {
        id: texts.length.toString(),
        x: 0,
        y: 0,
        isDragging: false,
        content: textarea,
        pageIndex,
      },
    ]);
    setTextarea("");
  };
  const handleEditText = () => {
    setTexts(
      [...texts].map((i) => {
        if (i?.id == contextMenuData?.data?.id) {
          i.content = textarea;
        }
        return i;
      }),
    );
    setTextarea("");
    setIsEditing(false);
  };

  const handleDeleteText = (id) => {
    setTexts([...texts].filter((text) => text.id != id));
  };

  // const handleDragStart = (e) => {
  //   const id = e.target.id();
  //   setTexts(
  //     texts.map((text) => {
  //       return {
  //         ...text,
  //         isDragging: text.id === id,
  //       };
  //     }),
  //   );
  // };
  // const handleDragEnd = (e) => {
  //   setTexts(
  //     texts.map((text) => {
  //       return {
  //         ...text,
  //         isDragging: false,
  //       };
  //     }),
  //   );
  // };

  const handleXuatFile = async () => {
    try {
      if (!url) {
        message.error(LOI);
        return;
      }

      const finalImages = images.map((image) => {
        return {
          y: image.finalY,
          x: image.finalX,
          img_w: image.width,
          img_h: image.height,
          imgSign: image.src,
          pageSign: image.pageIndex + 1,
        };
      });

      const finalTexts = texts.map((text) => {
        return {
          y: text.finalY,
          x: text.finalX,
          img_w: text.width,
          img_h: text.height,
          pageSign: text.pageIndex + 1,
          textSign: text.content,
        };
      });

      // const res = await axios.post(`${API_URL}Kysos/signtest`, {
      //   inputFile: url,
      //   id_NguoiDung: params?.id,
      //   PostPositionSigns: [...finalImages, ...finalTexts],
      // });
      console.log(
        JSON.stringify({
          inputFile: url,
          id_NguoiDung: params?.id,
          postPositionSigns: [...finalImages, ...finalTexts],
        }),
      );
      const res = await kyThuSvc({
        inputFile: url,
        id_NguoiDung: params?.id,
        postPositionSigns: [...finalImages, ...finalTexts],
      });

      console.log(res.data);

      if (res.status === SUCCESS && res.data.retCode === RETCODE_SUCCESS) {
        const file = res.data.data;
        setResFile(file);
      }
    } catch (error) {
      console.log("error");
      console.log(error);
      message.error(LOI_HE_THONG);
    } finally {
      setXuatLoading(false);
    }
  };

  const hiddenInputs = (
    <>
      <input
        data-testid="pdf-input"
        ref={pdfInput}
        type="file"
        name="pdf"
        id="pdf"
        accept="application/pdf"
        onChange={uploadPdf}
        onClick={onClick}
        style={{ display: "none" }}
      />
      <input
        ref={imageInputRef}
        type="file"
        id="image"
        name="image"
        accept="image/*"
        onClick={onImageInputClick}
        style={{ display: "none" }}
        onChange={onImageInputChange}
      />
    </>
  );

  useEffect(() => {
    if (url) {
      handleXuatFile();
    }
  }, [url]);

  const handleGetThongSo = async () => {
    try {
      const res = await getThongSoNguoiDungSvc({ id: params?.id });

      setNguoiDungKi(res.data?.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (!!params?.id) {
      handleGetThongSo();
    }
  }, [params?.id]);

  return (
    <div className="mx-auto" style={{ width: "100%", minHeight: "100vh" }}>
      <div>
        {true && (
          <div
            className="d-flex justify-content-between mx-auto mt-3"
            style={{ width: "95%" }}>
            <div>
              <div>Chữ Ký</div>
              <Select
                placeholder="Chọn chữ Ký"
                style={{
                  width: 120,
                }}
                onChange={handleSignChange}>
                {!!nguoiDungKi?.hinh1 && (
                  <Option key={nguoiDungKi?.hinh1} value={nguoiDungKi?.hinh1}>
                    Chữ ký 1
                  </Option>
                )}

                {!!nguoiDungKi?.hinh2 && (
                  <Option key={nguoiDungKi?.hinh2} value={nguoiDungKi?.hinh2}>
                    Chữ ký 2
                  </Option>
                )}

                {!!nguoiDungKi?.hinh3 && (
                  <Option key={nguoiDungKi?.hinh3} value={nguoiDungKi?.hinh3}>
                    Chữ ký 3
                  </Option>
                )}
              </Select>

              <div style={{ width: 300, marginTop: 10 }}>
                <div>Nội dung</div>
                <TextArea
                  rows={4}
                  value={textarea}
                  onChange={(e) => setTextarea(e.currentTarget.value)}
                />
                <Button
                  type="primary"
                  style={{ backgroundColor: "#2ec729", border: "none" }}
                  onClick={isEditing ? handleEditText : handleAddText}>
                  {isEditing ? "Sửa" : "Thêm"} nội dung
                </Button>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-3 me-4 gap-3">
              {!!resFile && (
                <Button
                  type="primary"
                  style={{ backgroundColor: "#ff8a2a", border: "none" }}
                  onClick={() => {
                    window.open(API_DOMAIN + resFile);
                  }}>
                  Mở file
                </Button>
              )}

              <Button
                loading={xuatLoading}
                type="primary"
                onClick={() => {
                  setXuatLoading(true);
                  uploadToFireBase();
                }}>
                Xuất
              </Button>
            </div>
          </div>
        )}
      </div>
      {hiddenInputs}

      {!file ? (
        <div>
          <Empty loading={isUploading} uploadPdf={handlePdfClick} />
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 10,
            }}>
            <Pagination
              firstItem={isFirstPage ? null : undefined}
              lastItem={isLastPage ? null : undefined}
              defaultActivePage={1}
              totalPages={totalPages}
              onPageChange={(e, data) => {
                setActivePage(data.activePage);
              }}
            />
          </div>

          {currentPage && (
            <div
              style={{
                position: "relative",
                width: "fit-content",
                marginInline: "auto",
              }}>
              <Page
                setPdfSize={setPdfSize}
                dimensions={dimensions}
                updateDimensions={setDimensions}
                page={currentPage}
                pages={pages}
                getPageSizes={(sizes) => {
                  if (pdfSizes.length === 0) {
                    setPdfSizes(sizes);
                  }
                }}
              />
              <Stage
                onClick={() => setContextMenuVisible(false)}
                height={pdfSize.height}
                width={pdfSize.width}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  boxShadow: "0 0 1px #000",
                }}>
                <Layer>
                  {images
                    .filter((image) => image.pageIndex === pageIndex)
                    .map((image) => (
                      <LionImage
                        src={image.src}
                        key={image.id}
                        id={image.id?.toString()}
                        x={image.x}
                        y={image.y}
                        draggable
                        onDragStart={() => {}}
                        onDragEnd={() => {}}
                        onContextMenu={(e) => {
                          setContextMenuVisible(true);
                          handleContextMenu(e, image, "image");
                        }}
                        onChangePos={(data) => {
                          setImages(
                            [...images].map((image, index) => {
                              const x = data?.x;
                              const y = data?.y;
                              const width = data?.width;
                              const height = data?.height;

                              if (image?.id == data?.id) {
                                image.x = x;
                                image.y = y;
                                const finalY =
                                  pdfSizes[index].height - y - height;
                                const finalX = x;

                                return {
                                  ...image,
                                  width,
                                  height,
                                  finalX,
                                  finalY,
                                };
                              }

                              return {
                                ...image,
                                width,
                                height,
                              };
                            }),
                          );
                        }}
                      />
                    ))}

                  {texts
                    .filter((text) => text.pageIndex === pageIndex)
                    .map((text) => (
                      <LionText
                        text={text.content}
                        key={text.id}
                        id={text.id?.toString()}
                        x={text.x}
                        y={text.y}
                        draggable
                        onDragStart={() => {}}
                        onDragEnd={() => {}}
                        onContextMenu={(e) => {
                          setContextMenuVisible(true);
                          handleContextMenu(e, text, "text");
                        }}
                        onChangePos={(data) => {
                          setTexts(
                            [...texts].map((text, index) => {
                              const x = data?.x;
                              const y = data?.y;
                              const width = data?.width;
                              const height = data?.height;

                              if (text?.id == data?.id) {
                                text.x = x;
                                text.y = y;
                                const finalY =
                                  pdfSizes[index].height - y - height;
                                const finalX = x;

                                return {
                                  ...text,
                                  width,
                                  height,
                                  finalX,
                                  finalY,
                                };
                              }

                              return {
                                ...text,
                                width,
                                height,
                              };
                            }),
                          );
                        }}
                      />
                    ))}

                  {/* {texts
                    .filter((text) => text.pageIndex === pageIndex)
                    .map((text) => (
                      <Text
                        key={text.id}
                        id={text.id}
                        x={text.x}
                        y={text.y}
                        draggable
                        onDragStart={() => {}}
                        onDragEnd={(e) => {
                          setTexts(
                            [...texts].map((text, index) => {
                              const x = data?.x;
                              const y = data?.y;
                              const width = data?.width;
                              const height = data?.height;

                              if (text?.id == data?.id) {
                                text.x = x;
                                text.y = y;
                                const finalY =
                                  pdfSizes[index].height - y - height;
                                const finalX = x;

                                console.log({
                                  ...text,
                                  width,
                                  height,
                                  finalX,
                                  finalY,
                                });

                                return {
                                  ...text,
                                  width,
                                  height,
                                  finalX,
                                  finalY,
                                };
                              }

                              return {
                                ...text,
                                width,
                                height,
                              };
                            }),
                          );
                        }}
                        text={text.content}
                        onContextMenu={(e) => {
                          setContextMenuVisible(true);
                          handleContextMenu(e, text, "text");
                        }}
                      />
                    ))} */}

                  {contextMenuVisible && (
                    <ContextMenu
                      contextMenuData={contextMenuData}
                      onSelectMenuOption={(option) => {
                        setContextMenuVisible(false);

                        if (option === "edit") {
                          setIsEditing(true);
                          if (contextMenuData?.type === "text") {
                            setTextarea(contextMenuData?.data?.content);
                          }
                        }

                        if (option === "delete") {
                          if (contextMenuData?.type === "image") {
                            handleDeleteImage(contextMenuData?.data?.id);
                          }

                          if (contextMenuData?.type === "text") {
                            handleDeleteText(contextMenuData?.data?.id);
                          }
                        }
                      }}
                    />
                  )}

                  {/* {stars.map((star) => (
                    <Star
                      key={star.id}
                      id={star.id}
                      x={star.x}
                      y={star.y}
                      numPoints={5}
                      innerRadius={20}
                      outerRadius={40}
                      fill="#89b717"
                      opacity={0.8}
                      draggable
                      rotation={star.rotation}
                      shadowColor="black"
                      shadowBlur={10}
                      shadowOpacity={0.6}
                      shadowOffsetX={star.isDragging ? 10 : 5}
                      shadowOffsetY={star.isDragging ? 10 : 5}
                      scaleX={star.isDragging ? 1.2 : 1}
                      scaleY={star.isDragging ? 1.2 : 1}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))} */}
                </Layer>
              </Stage>
              {/* {dimensions && (
                <Attachments
                  pdfName={name}
                  removeAttachment={remove}
                  updateAttachment={update}
                  pageDimensions={dimensions}
                  attachments={pageAttachments}
                />
              )} */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KiThu;

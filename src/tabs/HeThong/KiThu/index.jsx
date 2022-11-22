import React, { useEffect, useState } from "react";

import { Image as KonvaImage, Layer, Stage, Text } from "react-konva";
import { Pagination } from "semantic-ui-react";
import { Select, Input, message, Button, Modal, Form, Radio } from "antd";
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
import { useLocation, useParams, useRoutes, useNavigate } from "react-router-dom";
import { getThongSoNguoiDungSvc } from "../../../store/kyso_thongso/services";
import { getChiTietBuocDuyetSvc, kyThatSvc, kyThuSvc } from "../../../store/kyso/services";
import { v4 as uuidv4 } from "uuid";
import { Document } from 'react-pdf';
import * as TAB from '../../../constants/tab'
import { nguoiDungSelector } from "../../../store/auth/selectors";
import {useSelector} from 'react-redux'
import QrImg from '../../../assets/images/qr.png'
import {ganMaQrSvc} from '../../../store/maQR/service'
import { AiOutlineSetting } from "react-icons/ai";
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
  const location = useLocation();
  const isKiThat = location.pathname.includes('ki-that');
  const isGanMaQR = location.pathname.includes('gan-ma-qr')
  const _file_ = localStorage.getItem('ki-that')
  const _file_gan_ma_ = localStorage.getItem('gan-ma-qr');

  const navigate = useNavigate()

  const nguoiDung  = useSelector(nguoiDungSelector)

  const [nguoiDungKi, setNguoiDungKi] = useState(null);

  const [pdfSizes, setPdfSizes] = useState([]);
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });
  const [texts, setTexts] = useState([]);
  const [resFile, setResFile] = useState(null);

  const [modalCauHinhQr, setModalCauHinhQr] = useState(false)

  const [images, setImages] = useState([]);
  const [contextMenuData, setContextMenuData] = useState(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [textarea, setTextarea] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [xuatLoading, setXuatLoading] = useState(false);

  const [disableXuat, setDisableXuat] = useState(true);
  const [loadingFile, setLoadingFile] = useState(false)
  const [formCauHinhQR] = Form.useForm();

  const [chiTietBuocDuyet, setChiTietBuocDuyet] = useState(null)

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
    isFirstPage,
    isLastPage,
    currentPage,
    setDimensions,
    dimensions,
    totalPages,
    setActivePage,
    pages,
  } = usePdf();

  const { add: addAttachment, reset: resetAttachments } = useAttachments();

  const { uploadFile: uploadToFireBase, url } = useUploadFileToFireBase({
    file: pdfFile,
  });

  const {
    inputRef: imageInputRef,
    onClick: onImageInputClick,
    upload: onImageInputChange,
  } = useUploader({
    use: UploadTypes.IMAGE,
    afterUploadAttachment: addAttachment,
  });

  const getChiTietBuocDuyet = async () => {
    try {
      const res = await getChiTietBuocDuyetSvc({id: params?.id})

      setChiTietBuocDuyet(res.data?.data)
    } catch (error) {
      
    }
  }

  const handleChonChuKy = (value, option) => {
    const key = option?.key;

    if (key) {
      setImages([
        ...images,
        {
          ...option,
          id: uuidv4(),
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

  const e = 1.388888889

  const handleXuatFile = async () => {
    try {
      if (!url) {
        //message.error(LOI);
        return;
      }

      const finalImages = images.map((image) => {
        return {
          y: Math.round(image.finalY/e),
          x: Math.round(image.finalX/e),
          img_w: Math.round(image.width/e),
          img_h: Math.round(image.height/e),
          imgSign: image.src?.split(API_DOMAIN).join(''),
          pageSign: image.pageIndex + 1,
        };
      });

      const finalTexts = texts.map((text) => {
        return {
          y: Math.round(text.finalY),
          x: Math.round(text.finalX),
          img_w: Math.round(text.width),
          img_h: Math.round(text.height),
          pageSign: text.pageIndex + 1,
          textSign: text.content,
        };
      });

     


      if(isKiThat) {
        // console.log(_file_)
        // console.log({
        //   inputFile: _file_,
        //   id_NguoiDung: nguoiDung?.ma_NguoiDung,
        //   postPositionSigns: [...finalImages, ...finalTexts],
        //   ma_BuocDuyet: parseInt(isNaN(params?.id) ? '0' : params?.id)
        // })
        const res = await kyThatSvc({
          inputFile: _file_,
          id_NguoiDung: nguoiDung?.ma_NguoiDung,
          postPositionSigns: [...finalImages, ...finalTexts],
          ma_BuocDuyet: parseInt(isNaN(params?.id) ? '0' : params?.id)
        });

        if(res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
          message.success(res.data?.retText)
          navigate('/' + TAB.KI_DA_DUYET + '/detail/' + chiTietBuocDuyet?.ma_KySoDeXuat, {replace: true})
        }
      } else {

        const res = await kyThuSvc({
          inputFile: url,
          id_NguoiDung: params?.id,
          postPositionSigns: [...finalImages, ...finalTexts],
        });

        console.log({
          inputFile: url,
          id_NguoiDung: params?.id,
          postPositionSigns: [...finalImages, ...finalTexts],
        })

        
  
        if (res.status === SUCCESS && res.data.retCode === RETCODE_SUCCESS) {
          const file = res.data.data;
          setResFile(file);
        } else {
          message.error(res.data?.retText)
        }
      }
      

      
    } catch (error) {
      console.log("error");
      console.log(error);
      //message.error(LOI_HE_THONG);
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
      const res = await getThongSoNguoiDungSvc({ id:isKiThat ?  nguoiDung?.ma_NguoiDung : params?.id });
      const currentUser = res.data?.data;
      setNguoiDungKi({
        ...currentUser,
        hinh1: currentUser?.hinh1 ? API_DOMAIN + currentUser?.hinh1 : null,
        hinh2: currentUser?.hinh2 ? API_DOMAIN + currentUser?.hinh2 : null,
        hinh3: currentUser?.hinh3 ? API_DOMAIN + currentUser?.hinh3 : null,
      });
    } catch (error) {}
  };

  const handleXacNhan = async () => {
    // const finalImages = images.map((image) => {
    //   return {
    //     y: image.finalY,
    //     x: image.finalX,
    //     img_w: image.width,
    //     img_h: image.height,
    //     pageSign: image.pageIndex + 1,
    //   };
    // });
    // console.log(localStorage.getItem('cau-hinh-qr'))
    const mucDoStr = localStorage.getItem('cau-hinh-qr');

    const ma_DeXuat = parseInt(params?.id)
    const ma_NguoiTao = nguoiDung?.ma_NguoiDung;
    const image = images?.[0];
    const left = Math.round(image.finalX/e)
    const top = Math.round(image.finalY/e + 5)
    const page = image.pageIndex + 1
    const inputFile = _file_gan_ma_;
    const mucDo = mucDoStr ? parseInt(mucDoStr) : 1;

    // console.log(left, top)
    // console.log(image.finalX, image.finalY)

    const data = {
      ma_DeXuat,
      ma_NguoiTao,
      left,
      top,
      page,
      inputFile,
      mucDo
    }

    try {
      setXuatLoading(true)

      const res = await ganMaQrSvc(data);

      if(res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText)
        navigate(-1)
      } else {
        message.error(res.data?.retText)
      }
    } catch (error) {
      
    } finally {
      setXuatLoading(false)
    }
  
  }

  useEffect(() => {
    if (!!params?.id) {
      handleGetThongSo();
      getChiTietBuocDuyet();
    }
  }, [params?.id]);


  function urltoFile(url, filename, mimeType){
    return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename,{type:mimeType});})
    );
}
 
  const aaaa = (link) => {
    var request = new XMLHttpRequest();
    request.open('GET', link, true);
    request.responseType = 'blob';
    request.onload = function() {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload =  function(e){
          urltoFile(e.target.result, 'hello.pdf','application/pdf')
          .then(function(file){ 
    
            uploadPdf(null, file)
          });
        };
    };
    request.send();
  }
   useEffect(()=>{
    if(isKiThat && !!_file_) {
      aaaa( API_DOMAIN + _file_)
    }
  },[isKiThat, _file_])

  const [first, setFirst] = useState(true)


  useEffect(() => {
    if(isGanMaQR && !!_file_gan_ma_) {
      setFirst(false)
      aaaa(API_DOMAIN + _file_gan_ma_)
      setImages([{
          id: uuidv4(),
          x: 0,
          y: 0,
          isDragging: false,
          src: QrImg,
          pageIndex: 0,
      }]) 
    }
  }, [isGanMaQR, _file_gan_ma_]);

  useEffect(() => {
    const a = async () => {
      const pageIndex = (await currentPage).pageIndex;

      setImages([...images].map(item => {
        return {
          ...item,
          pageIndex,
        }
      }))
    //   setImages([{
    //     id: uuidv4(),
    //     x: 0,
    //     y: 0,
    //     isDragging: false,
    //     src: QrImg,
    //     pageIndex: (await currentPage).pageIndex,
    // }]) 
    }

    if(currentPage && isGanMaQR && !first) {
      a()
    }
  }, [currentPage]);

  useEffect(() => {
    localStorage.removeItem('cau-hinh-qr')
  }, []);

  return (
    <div className="mx-auto" style={{ width: "100%", minHeight: "100vh" }}>
      <Modal
        width={550}
        title={"Cấu hình QR"}
        open={modalCauHinhQr}
        onOk={() => {}}
        onCancel={() => {
          // setModalPasscodeVisible(false);
          // formPasscode.resetFields();
          setModalCauHinhQr(false)
        }}
        footer={null}>
        <Form
          form={formCauHinhQR}
          name="formCauHinhQR"
          onFinish={(values) => {
            localStorage.setItem('cau-hinh-qr', values?.state)
            setModalCauHinhQr(false)
          }}
          autoComplete="off"
          initialValues={{
            state: 1
          }}
          >
           <Form.Item label="" name='state'>
             <Radio.Group onChange={e => {
             }}>
               <Radio value={1}>Xem file với mã QR</Radio>
               <Radio value={2}>Đăng nhập + Mã QR</Radio>
               <Radio value={3}>Không cho xem</Radio>
             </Radio.Group>
           </Form.Item>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <Form.Item>
              <Button
                type="ghost"
                htmlType="button"
                onClick={() => setModalCauHinhQr(false)}>
                Bỏ qua
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                loading={false}
                type="primary"
                htmlType="submit">
                Đồng ý
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <div>
        {!!file && (
          <div
            className="d-flex justify-content-between mx-auto mt-3"
            style={{ width: "95%" }}>
            {!isGanMaQR && <div>
              <div>Chữ Ký</div>
              <Select
                placeholder="Chọn chữ Ký"
                style={{
                  width: 120,
                }}
                onSelect={handleChonChuKy}>
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
                  style={{
                    borderRadius: 10
                  }}
                  rows={4}
                  value={textarea}
                  onChange={(e) => setTextarea(e.currentTarget.value)}
                />
                <Button
                  disabled={!textarea.trim()}
                  type="primary"
                  className="mt-2 rounded"
                  style={{ backgroundColor: "#6CD44A", border: "none", color: '#fff' }}
                  onClick={isEditing ? handleEditText : handleAddText}>
                  {isEditing ? "Sửa" : "Thêm"} nội dung
                </Button>
              </div>
            </div>}

            <div className="d-flex mt-3 me-4 gap-3" style={{
              marginLeft: isGanMaQR ? 'auto' : undefined,
              justifyContent: isGanMaQR ? 'space-between' : 'flex-end',
              flex: isGanMaQR ? 1 : undefined
            }}>
              {!!resFile && (
                <Button
                  type="primary"
                  style={{ backgroundColor: "#ff8a2a", border: "none", borderRadius: 10, width: 150 }}
                  onClick={() => {
                    window.open(API_DOMAIN + resFile);
                  }}>
                  Mở file
                </Button>
              )}

         {isGanMaQR &&   <Button
                // onClick={() => setModalDeXuatVisible(true)}
                onClick={() => {
                  // navigate('/' + TAB.GAN_MA_QR)
                  setModalCauHinhQr(true)
                }}
                className="d-flex align-items-center"
                type="ghost"
                icon={<AiOutlineSetting />}>
                Cấu hình QR
              </Button>}

              <Button
                disabled={disableXuat}
                loading={xuatLoading}
                type="primary"
                style={{width: 150, borderRadius: 10}}
                onClick={() => {
             

                  if(isGanMaQR) {
                    handleXacNhan()
                  } else {
                    setXuatLoading(true);
                    uploadToFireBase();
                  }
                }}>
                {isGanMaQR ? 'Xác nhận' : 'Ký duyệt'}
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
              marginTop: 15
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
                    console.log(sizes)
                    setPdfSizes(sizes?.map(item => {
                      return {
                        width: item?.width,
                        height: item?.height,
                      }
                    }));
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
                    .filter((image) => image?.pageIndex === pageIndex)
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
                          setDisableXuat(false);
                          setImages(
                            [...images].map((image, index) => {
                              const x = data?.x;
                              const y = data?.y;
                              const width = data?.width;
                              const height = data?.height;

                              const finalY =
                              pdfSizes[pageIndex]?.height - y - height;
                              const finalX = x;

                              if (image?.id == data?.id) {
                                image.x = x;
                                image.y = y;

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
                          setDisableXuat(false);
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

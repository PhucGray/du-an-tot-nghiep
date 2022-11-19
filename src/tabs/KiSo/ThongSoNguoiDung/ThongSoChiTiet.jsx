import { Button, Form, Input, Modal, Radio, Upload, message, Table, Checkbox } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  EditOutlined,
  LockOutlined,
  SettingOutlined,
  HistoryOutlined,
  HighlightOutlined,
  UploadOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { textToCharacter } from "../../../utils/strings";
import useUploadFileToFireBase from "../../../hooks/useUploadFileToFireBase";
import {
  LOI,
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../constants/api";
import {
  suaCauHinhPfxSvc,
  suaPasscodeSvc,
} from "../../../store/kyso_thongso/services";
import { transformUser } from "../../../utils/user";
import { useNavigate } from "react-router-dom";
import * as TAB from "../../../constants/tab";
import { logThongSoSvc } from "../../../store/log/service";
import moment from "moment";
import { API_DOMAIN } from "../../../configs/api";
const VUI_LONG_CHON_FILE = "Vui lòng chọn file pfx";

const Row = ({ label, children, even = true }) => {
  return (
    <div
      className="d-flex"
      style={{ backgroundColor: even ? "#d9d9d9" : "#fff", minHeight: 50 }}>
      <div
        className="d-flex align-items-center justify-content-end pe-2"
        style={{
          width: 200,
          textAlign: "right",
          marginRight: 10,
        }}>
        {label}
      </div>
      <div
        style={{
          // minHeight: "100%",s
          // width: 1,
          backgroundColor: even ? "#fff" : "#d9d9d9",
        }}></div>
      <div
        className="d-flex align-items-center"
        style={{
          paddingLeft: 10,
        }}>
        {children}
      </div>
    </div>
  );
};

const PASSCODE = "passcode";
const CAU_HINH = "cauhinh";

const _Modal = ({
  form,
  type = PASSCODE,
  visible = false,
  onClose = () => {},
  fileError = "",
  loading = false,
  setFile,
  inputFileRef,
  fileName,
  onUploadClick = () => {},
  detailData,
  setCurrentUserDetail,
  getListThongSo,
  resetFilePfx,
  filePfxUrl,
  setFileError,
}) => {
  let title = "";

  switch (type) {
    case PASSCODE:
      title = "Sửa passcode";
      break;
    case CAU_HINH:
      title = "Cấu hình chữ ký";
      break;
  }

  const [cauhinhType, setCauhinhType] = useState(0);

  const [submitLoading, setSubmitLoading] = useState(false);

  const handleDoiPasscode = async (values) => {
    setSubmitLoading(true);
    const data = {
      ...values,
      ma_NguoiDung: detailData?.ma_NguoiDung,
    };

    try {
      const res = await suaPasscodeSvc(data);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        form.resetFields();
        // setCurrentUserDetail(transformUser(res.data?.data));
        // console.log(transformUser(res.data?.data));
        onClose();
        // window.location.reload();
      } else {
        message.error(res.data?.retText);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleDoiCauHinh = async (values) => {
    setSubmitLoading(true);

    if (!fileName) {
      setFileError(VUI_LONG_CHON_FILE);
      return;
    }

    const data = {
      ...values,
      ma_NguoiDung: detailData?.ma_NguoiDung,
      filePfx: filePfxUrl,
      loaiChuKy: true
    };

    try {
      const res = await suaCauHinhPfxSvc(data);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        form.resetFields();
        // setCurrentUserDetail(transformUser(res.data?.data));
        resetFilePfx();
        onClose();
        message.success(res.data?.retText);
        // window.location.reload();
      } else {
        message.error(res.data?.retText);
      }
    } catch (error) {
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSmartSign = async (values) => {
    setSubmitLoading(true);

    const data = {
      ...values,
      ma_NguoiDung: detailData?.ma_NguoiDung,
      loaiChuKy: false
    };

    try {
      const res = await suaCauHinhPfxSvc(data);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        form.resetFields();
        // setCurrentUserDetail(transformUser(res.data?.data));
        onClose();
      } else {
        message.error(res.data?.retText);
      }
    } catch (error) {
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <Modal
      getListThongSo={getListThongSo}
      title={title}
      open={visible}
      onOk={() => {}}
      onCancel={() => {
        onClose();
      }}
      footer={null}>
      <Form
        form={form}
        name="suapassword"
        onFinish={type === PASSCODE ? handleDoiPasscode : (cauhinhType === 0 ? handleDoiCauHinh : handleSmartSign)}
        initialValues={{ loaiChuKy: 0 }}
        autoComplete="off"
        layout={type === PASSCODE ? "vertical" : "horizontal"}>
        {type === PASSCODE && (
          <>
            <Form.Item
              label="Passcode hiện tại"
              name="passCode"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập passcode cũ!",
                },
              ]}>
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Passcode mới"
              name="newPassCode"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập passcode mới!",
                },
              ]}>
              <Input.Password />
            </Form.Item>
          </>
        )}

        {type === CAU_HINH && (
          <>
            <Form.Item
              name="loaiChuKy"
              label="Loại chữ ký"
              labelCol={{
                span: 5,
              }}>
              <Radio.Group onChange={e => {
                setCauhinhType(e.target.value)
              }}>
                <Radio checked value={0}>File chữ ký</Radio>
                <Radio value={1}>SmartSign VNPT</Radio>
              </Radio.Group>
            </Form.Item>

           {cauhinhType === 1 &&  <>
              <Form.Item
                label="Client id"
                name="client_ID"
                labelCol={{
                  span: 7,
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập client id!",
                  },
                ]}>
                <Input />
              </Form.Item>

              <Form.Item
                label="Client secret"
                name="client_Secret"
                labelCol={{
                  span: 7,
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập client secret!",
                  },
                ]}>
                <Input />
              </Form.Item>

              <Form.Item
                label="Uid"
                name="uid"
                labelCol={{
                  span: 7,
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập uid!",
                  },
                ]}>
                <Input />

             
              </Form.Item>

              <Form.Item
                label="Customer pass"
                name="passwordSmartSign"
                labelCol={{
                  span: 7,
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập customer pass",
                  },
                ]}>
                <Input.Password />
              </Form.Item>

              <Form.Item
                 label="Display valid"
                 name="isDislayValid"
                 valuePropName="checked"
                 labelCol={{
                   span: 7,
                 }}>
                <Checkbox> </Checkbox>
              </Form.Item>
            </>}

           {cauhinhType === 0 && <>
            <div className="ms-3 d-flex flex-column" style={{ marginTop: -10 }}>
              <div className="d-flex align-items-center">
                <Button
                  onClick={onUploadClick}
                  className="d-flex align-items-center"
                  type="link"
                  icon={<CloudUploadOutlined />}>
                  Đính kèm file
                </Button>

                {fileName}
              </div>

              {!!fileError && (
                <div className="ms-3 ant-form-item-explain-error">
                  {fileError}
                </div>
              )}
            </div>

            <Form.Item
              labelCol={{
                span: 5,
              }}
              label="Mật khẩu"
              name="passcodeFilePfx"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập passcode!",
                },
              ]}>
              <Input.Password />
            </Form.Item>
            </>}
          </>
        )}

        <div className="d-flex justify-content-center gap-3">
          <Form.Item>
            <Button type="ghost" htmlType="button" onClick={onClose}>
              Bỏ qua
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading || submitLoading}
              type="primary"
              htmlType="submit">
              Đồng ý
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

const ThongSoChiTiet = ({
  currentUserDetail: data,
  setCurrentUserDetail,
  handleShowModalEdit,
}) => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(CAU_HINH);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");

  const {
    percent,
    uploading,
    uploadFile: uploadToFireBase,
    url,
    resetFile,
  } = useUploadFileToFireBase({ file });

  const inputFileRef = useRef();

  const [form] = Form.useForm();

  const resetPfx = () => {
    resetFile();
    setFile(null);
    setFileName(null);
  };

  useEffect(() => {
    if (file) {
      uploadToFireBase();
      setFileError("");
    }
  }, [file]);

  const [log, setLog] = useState(null)

  const logThongSo = async (id) => {
    try {
      const res = await logThongSoSvc({id})
      setLog(res?.data?.data?.map(item => {
        return {
          ...item,
          hoTen: item?.nguoiDung?.hoTen,
        }
      }))
    } catch (error) {
      
    }
  }

  const columns = [
    {
      title: "Người thực hiện",
      dataIndex: "hoTen",
      key: "hoTen",
    },
    {
      title: "Hành động",
      dataIndex: "ten_Log",
      key: "ten_Log",
    },
    {
      title: "Thời gian thực hiện",
      dataIndex: "thoiGianThucHien",
      key: "thoiGianThucHien",
      render: (_, record) => {
        return <>{moment(_).format('DD-MM-YYYY')}</>
      }
    },
  ];

  // console.log(data)

  return (
    <>
      <Modal footer={null} open={!!log} title='Lịch sử' onCancel={() => setLog(null)}>
        <Table 
          columns={columns}
          dataSource={log}
        />
      </Modal>

      <input
        style={{ position: "absolute", left: "-100vw" }}
        className="input-file"
        ref={inputFileRef}
        type="file"
        // accept="application/x-pkcs12"
        multiple={false}
        onChange={async (e) => {
          if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = e.target.files;
            const file = selectedFiles[0];

            if (file.type !== "application/x-pkcs12") {
              setFileError(VUI_LONG_CHON_FILE);
            } else {
              setFile(file);
              setFileName(file.name);
            }
          }
        }}
      />

      <_Modal
        filePfxUrl={url}
        resetFilePfx={resetPfx}
        detailData={data}
        fileError={fileError}
        form={form}
        type={modalType}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        loading={uploading}
        fileName={fileName}
        setFileError={setFileError}
        setCurrentUserDetail={setCurrentUserDetail}
        onUploadClick={() => {
          setFile(null);
          inputFileRef.current?.click();
        }}
      />
      <div>
        <Button
          type="link"
          className="ms-3 mt-3"
          onClick={() => {
            setCurrentUserDetail(null);
            navigate("/" + TAB.THONG_SO_NGUOI_DUNG);
          }}>
          Trở lại danh sách
        </Button>

        <div className="d-flex justify-content-center">
          <Button
            onClick={() => handleShowModalEdit(data)}
            className="d-flex align-items-center text-black"
            type="link"
            icon={<EditOutlined />}>
            Sửa thông số
          </Button>

          <Button
            onClick={() => {
              setModalVisible(true);
              setModalType(PASSCODE);
            }}
            className="d-flex align-items-center text-black"
            type="link"
            icon={<LockOutlined />}>
            Đổi passcode
          </Button>

          <Button
            onClick={() => {
              setModalVisible(true);
              setModalType(CAU_HINH);
            }}
            className="d-flex align-items-center text-black"
            type="link"
            icon={<SettingOutlined />}>
            Cấu hình chữ ký
          </Button>

          <Button
            onClick={() => {
              navigate(
                "/" + TAB.THONG_SO_NGUOI_DUNG + "/ki-thu/" + data?.ma_NguoiDung,
              );
            }}
            className="d-flex align-items-center text-black"
            type="link"
            icon={<HighlightOutlined />}>
            Ký thử
          </Button>

          <Button
            onClick={() => logThongSo(data?.ma_NguoiDung)}
            className="d-flex align-items-center text-black"
            type="link"
            icon={<HistoryOutlined />}>
            Lịch sử
          </Button>
        </div>

        <div className="mt-2" style={{ paddingInline: 40 }}>
          <Row label="Người ký">
            <div className="d-flex align-items-center">
              <div>{data?.hoTen}</div>
            </div>
          </Row>

          <Row label="Trạng thái" even={false}>
            {data?.trangThai ? "Đang hiệu lực" : "Không hiệu lực"}
          </Row>

          <Row label="Lý do">{data?.lyDoMacDinh}</Row>

          <Row label="Hình 1" even={false}>
            {data?.hinh1 && <img src={data.hinh1} style={{}} />}
          </Row>
          <Row label="Hình 2">
            {data?.hinh2 && <img src={data.hinh2} style={{}} />}
          </Row>
          <Row label="Hình 3" even={false}>
            {data?.hinh3 && <img src={data.hinh3} style={{}} />}
          </Row>

          <Row label="Passcode">
            {textToCharacter({ text: data?.passCode })}
          </Row>

          <Row label="Serial" even={false}>
            {data?.serial}
          </Row>

          <Row label="Subject">{data?.subject}</Row>
        </div>
      </div>
    </>
  );
};

export default ThongSoChiTiet;

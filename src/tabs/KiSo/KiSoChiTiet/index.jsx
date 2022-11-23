import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Upload,
  message,
  Popconfirm,
  Table,
  Checkbox,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  EditOutlined,
  EditTwoTone,
  LockOutlined,
  SettingOutlined,
  HistoryOutlined,
  HighlightOutlined,
  UploadOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  ScheduleOutlined,
  FilePdfOutlined,
  FilePdfTwoTone,
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  CloseCircleTwoTone,
  FileOutlined,
  FileTwoTone,
  LoadingOutlined,
  QrcodeOutlined 
} from "@ant-design/icons";
import {AiOutlineQrcode, AiOutlineSetting} from 'react-icons/ai'
import { textToCharacter } from "../../../utils/strings";
import useUploadFileToFireBase from "../../../hooks/useUploadFileToFireBase";
import {
  LOI,
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../constants/api";
import {
  getListNguoiDungDuyetSvc,
  getListNguoiDungKySvc,
  suaCauHinhPfxSvc,
  suaPasscodeSvc,
} from "../../../store/kyso_thongso/services";
import { transformUser } from "../../../utils/user";
import { useLocation, useNavigate } from "react-router-dom";
import * as TAB from "../../../constants/tab";
import {
  chuyenDuyetSvc,
  getDsBuocDuyetSvc,
  getKSDXSvc,
  suaKSDXSvc,
  themBuocDuyetSvc,
  tuChoiKySvc,
  xoaBuocDuyetSvc,
  xoaKSDX,
} from "../../../store/kysodexuat/service";
import { useParams } from "react-router-dom";
import ModalBuocDuyet from "./ModalBuocDuyet";
import { kiemTraPasscodeSvc } from "../../../store/kyso/services";
import { useSelector } from "react-redux";
import { nguoiDungSelector } from "../../../store/auth/selectors";
import { logDeXuatSvc } from "../../../store/log/service";
import {
  getListTraoDoiSvc,
  themTraoDoiSvc,
  xoaTraoDoiSvc,
} from "../../../store/traodoi/services";
import moment from "moment";
import { API_DOMAIN } from "../../../configs/api";
import vi from "moment/locale/vi";
const { TextArea } = Input;
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

const KiSoChiTiet = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const nguoiDung = useSelector(nguoiDungSelector);
  const pageChiTietKyChoDuyet = location.pathname.includes(
    "ki-cho-duyet/detail",
  );

  const pageChiTietKyDaDuyet = location.pathname.includes(
    "ki-da-duyet/detail"
  )

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(CAU_HINH);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");

  const [fileTraoDoi, setFileTraoDoi] = useState(null);
  const [fileTraoDoiName, setFileTraoDoiName] = useState("");
  const [fileTraoDoiError, setFileTraoDoiError] = useState("");

  const [listTraoDoi, setListTraoDoi] = useState([]);

  const [KSDXData, setKSDXData] = useState(null);
  const [dsBuocDuyet, setDsBuocDuyet] = useState([]);
  const [dsNguoiDungDuyet, setDsNguoiDungDuyet] = useState([]);
  const [themBuocLoading, seThemBuocLoading] = useState(false);
  const [modalBuocDuyetVisible, setModalBuocDuyetVisible] = useState(false);
  const [modalPasscodeVisible, setModalPasscodeVisible] = useState(false);
  const [modalCauHinhQr, setModalCauHinhQr] = useState(false)

  const [suaDeXuatLoading, setSuaDeXuatLoading] = useState(false);
  const [chuyenDuyetLoading, setChuyenDuyetLoading] = useState(false);
  const [submitPasscodeLoading, setSubmitPasscodeLoading] = useState(false);
  const [addTraoDoiLoading, setAddTraoDoiLoading] = useState(false);

  const daChuyenDuyet = KSDXData?.trangThai;

  const buocDuyetHienTai = KSDXData?.kySoBuocDuyets?.find(
    (item) => item?.order === KSDXData?.curentOrder,
  );

  const isNguoiKyHienTai =
    buocDuyetHienTai?.ma_NguoiKy === nguoiDung?.ma_NguoiDung;

  const {
    percent,
    uploading,
    uploadFile: uploadToFireBase,
    url,
    resetFile,
  } = useUploadFileToFireBase({ file });

  const {
    percent: percenterTraoDoi,
    uploading: uploadingTraoDoi,
    uploadFile: uploadToFirebaseTraoDoi,
    url: urlTraoDoi,
    resetFile: resetFileTraoDoi,
  } = useUploadFileToFireBase({ file: fileTraoDoi });

  const inputFileRef = useRef();
  const inputTraoDoiRef = useRef();

  const [form] = Form.useForm();
  const [formDeXuat] = Form.useForm();
  const [formPasscode] = Form.useForm();
  const [formTraoDoi] = Form.useForm();
  const [formCauHinhQR] = Form.useForm();

  const handleKiemTraPasscode = async (values) => {
    const data = {
      ma_NguoiKy: nguoiDung?.ma_NguoiDung,
      passcode: values?.passcode,
    };

    try {
      setSubmitPasscodeLoading(true);

      const res = await kiemTraPasscodeSvc(data);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        localStorage.setItem("ki-that", KSDXData?.inputFile);
        navigate("/ki-cho-duyet/ki-that/" + buocDuyetHienTai?.ma_BuocDuyet);
      } else {
        message.error(res.data?.retText);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG)
    } finally {
      setSubmitPasscodeLoading(false);
    }
  };

  const getKSDX = async () => {
    try {
      const res = await getKSDXSvc({ id: params?.id });

      const data = res.data?.data;
      setKSDXData({
        ...data,
        tenFile: data?.ten_FileGoc,
        nguoiTao: data?.nguoiDung?.hoTen,
        stt: 1,
      });

      formDeXuat.setFieldValue("ten_DeXuat", data?.ten_DeXuat);
      formDeXuat.setFieldValue("loaiVanBan", data?.loaiVanBan);
      formDeXuat.setFieldValue("ghiChu", data?.ghiChu);
    } catch (error) {
      console.log(error);
      //message.error(LOI);
    } finally {
    }
  };

  const getDsBuocDuyet = async () => {
    try {
      const res = await getDsBuocDuyetSvc({ id: params?.id });

      setDsBuocDuyet(
        res.data?.data?.map((item, index) => {
          return {
            ...item,
            stt: index + 1,
            hoTen: item?.nguoiDung?.hoTen,
            trangThai: item?.isDaKy,
          };
        }),
      );
    } catch (error) {
      //message.error(LOI);
    } finally {
    }
  };

  const getDsNguoiDungDuyet = async () => {
    try {
      const res = await getListNguoiDungKySvc();

      setDsNguoiDungDuyet(res.data?.data);
    } catch (error) {
      //message.error(LOI);
    } finally {
    }
  };

  const handleThemBuocDuyet = async (values) => {
    seThemBuocLoading(true);
    try {
      const data = {
        ...values,
        ma_KySoDeXuat: params?.id,
      };

      const res = await themBuocDuyetSvc(data);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        getDsBuocDuyet();
      } else {
        message.error(res.data?.retText);
      }
      // if(res.status === SUCCESS )
    } catch (error) {
    } finally {
      seThemBuocLoading(false);
      setModalBuocDuyetVisible(false);
    }
  };

  const handleXoaBuocDuyet = async (buocduyet) => {
    try {
      const res = await xoaBuocDuyetSvc({ id: buocduyet?.ma_BuocDuyet });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        getDsBuocDuyet();
      }
    } catch (error) {
      //message.error(LOI);
    }
  };

  const handleXoaDeXuat = async () => {
    try {
      const res = await xoaKSDX({ id: params?.id });

      navigate("/" + TAB.KI_DE_XUAT);
    } catch (error) {
      //message.error(LOI);
    }
  };

  const getListTraoDoi = async () => {
    try {
      const res = await getListTraoDoiSvc({ id: KSDXData?.ma_KySoDeXuat });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setListTraoDoi(res.data?.data);
      }
    } catch (error) {}
  };

  const [modalDeXuatVisible, setModalDeXuatVisible] = useState(false);
  const [modalTraoDoiVisible, setModalTraoDoiVisible] = useState(false);

  const handleSuaDeXuat = async (values) => {
    // if (!file) return setFileError(" Vui lòng nhập chọn file");

    const data = {
      ...values,
      inputFile: url || null,
      ma_NguoiDeXuat: KSDXData?.ma_NguoiDeXuat,
      ma_KySoDeXuat: KSDXData?.ma_KySoDeXuat,
      ten_FileGoc: url ? fileName : null,
    };
    setSuaDeXuatLoading(true);

    try {
      const res = await suaKSDXSvc(data);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        formDeXuat.resetFields();
        setFile(null);
        resetFile();
        setFileName("");
        setModalDeXuatVisible(false);

        getKSDX();
        getDsBuocDuyet();
        getDsNguoiDungDuyet();
        inputFileRef.current.value = null;
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setSuaDeXuatLoading(false);
    }
  };

  const handleAddTraoDoi = async (values) => {
    const data = urlTraoDoi
      ? {
          ...values,
          ma_DeXuat: KSDXData?.ma_KySoDeXuat,
          ma_NguoiDung: nguoiDung?.ma_NguoiDung,
          fileDinhKem: urlTraoDoi,
        }
      : {
          ...values,
          ma_DeXuat: KSDXData?.ma_KySoDeXuat,
          ma_NguoiDung: nguoiDung?.ma_NguoiDung,
        };

    setAddTraoDoiLoading(true);
    try {
      const res = await themTraoDoiSvc(data);
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        formTraoDoi.resetFields();
        setFileTraoDoi(null);
        resetFileTraoDoi();
        setFileTraoDoiName("");
        setModalTraoDoiVisible(false);
        getKSDX();
        inputTraoDoiRef.current.value = null;
        getListTraoDoi();
      } else {
      }
    } catch (error) {
    } finally {
      setAddTraoDoiLoading(false);
    }
  };

  const handleXoaTraoDoi = async (traoDoi) => {
    try {
      const res = await xoaTraoDoiSvc({ id: traoDoi?.ma_Message });
      message.success(res.data?.retText);
      getListTraoDoi();
    } catch (error) {}
  };

  const handleTuChoi= async () => {
    try {
      // console.log(KSDXData?.kySoBuocDuyets?.find(i => i?.order === KSDXData?.curentOrder))
      const res = await tuChoiKySvc({id: KSDXData?.kySoBuocDuyets?.find(i => i?.order === KSDXData?.curentOrder)?.ma_BuocDuyet})

      if(res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText)
        navigate(-1)
      } else {
        message.error(res.data?.retText)
      }
    } catch (error) {
      //message.error(LOI_HE_THONG)
    } finally {

    }
  }


  const handleChuyenDuyet = async () => {
    setChuyenDuyetLoading(true);
    try {
      const res = await chuyenDuyetSvc({ id: KSDXData?.ma_KySoDeXuat });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        getKSDX();
        getDsBuocDuyet();
        getDsNguoiDungDuyet();
        message.success(res.data?.retText);
      } else {
        message.error(res.data?.retText);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG)
    } finally {
      setChuyenDuyetLoading(false);
    }
  };

  useEffect(() => {
    if (!modalTraoDoiVisible) {
      resetFileTraoDoi();
      inputFileRef.current.value = null;
    }
  }, [modalTraoDoiVisible]);

  useEffect(() => {
    if (file) {
      uploadToFireBase();
      setFileError("");
    }
  }, [file]);

  console.log(KSDXData)

  useEffect(() => {
    if (fileTraoDoi) {
      uploadToFirebaseTraoDoi();
      setFileTraoDoiError("");
    }
  }, [fileTraoDoi]);

  useEffect(() => {
    getKSDX();
    getDsBuocDuyet();
    getDsNguoiDungDuyet();
  }, []);

  useEffect(() => {
    if (KSDXData) {
      getListTraoDoi();
    }
  }, [KSDXData]);


  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Tên file",
      dataIndex: "tenFile",
      key: "tenFile",
      render: (_, record) => {
        return (
          <div
            onClick={() => {
              // window.open(_)
              window.open(API_DOMAIN + record?.inputFile, "_BLANK");
            }}
            className="d-flex align-items-center gap-2"
            style={{ flex: 1, cursor: 'pointer' }}>
            {/* {_?.split("files%")?.[1]?.split("?alt")?.[0]} */}
            {_}
            <FilePdfTwoTone twoToneColor={"red"} />
          </div>
        );
      },
    },
    {
      title: "Người tạo",
      dataIndex: "nguoiTao",
      key: "nguoiTao",
    },
  ];

  const columns_daky = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Tên file",
      dataIndex: "fileDaKy",
      key: "fileDaKy",
      render: (_, record) => {
        return (
          <div
            onClick={() => {
              window.open(API_DOMAIN +  (pageChiTietKyDaDuyet ? KSDD?.fileDaKy : _ ), "_BLANK");
            }}
            className="d-flex align-items-center gap-2"
            style={{ flex: 1, cursor: 'pointer' }}>
            {record.ten_FileGoc?.split('.pdf').join('_daky.pdf')}
            <FilePdfTwoTone twoToneColor={"red"} />
          </div>
        );
      },
    },
    {
      title: "Người tạo",
      dataIndex: "nguoiTao",
      key: "nguoiTao",
    },
  ];
  const renderRow = (item, bg = "gray", dangThucHien = false) => {
    return (
      <div className="d-flex">
        <div className="py-1" style={{ width: 40 }}>
          <div className="text-center">STT</div>
          <div
            className="text-center"
            style={{
              background: bg,
              borderRadius: 5,
              color: "#fff",
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            {item?.order}
          </div>
        </div>

        <div className="flex-grow-1 ps-3 py-1">
          <div>Người duyệt</div>
          <div style={{ height: 40, display: "flex", alignItems: "center" }}>
            {item?.hoTen}
          </div>
        </div>

        <div className="py-1">
          <div>Trạng thái</div>
          <div
            style={{ height: 40, display: "flex", alignItems: "center" }}
            className="d-flex align-items-center gap-2">
            {item?.trangThai ? (
              <>
                <CheckCircleTwoTone twoToneColor="#52c41a" />
                <div>Đã thực hiện</div>
              </>
            ) : dangThucHien ? (
              <>
                <>
                  <LoadingOutlined style={{color: 'orange'}} />
                  <div>Đang thực hiện</div>
                </>
              </>
            ) : (
              <>
                <ClockCircleTwoTone />
                <div>Chưa thực hiện</div>
              </>
            )}
          </div>
        </div>

        {!daChuyenDuyet && (
          <div className="ms-2">
            <div>Hành động</div>
            <div className="d-flex justify-content-center">
              <>
                {
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xoá?"
                    onConfirm={() => handleXoaBuocDuyet(item)}
                    okText="Đồng ý"
                    cancelText="Thoát">
                    <Button icon={<DeleteOutlined />} />
                  </Popconfirm>
                }
              </>
            </div>
          </div>
        )}
      </div>
    );
  };

  const columns_33 = [
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
        return <>{moment(_).fromNow()}</>
      },
    },
  ];
  const [log, setLog] = useState(null);
  const logDeXuat = async (id) => {
    try {
      const res = await logDeXuatSvc({ id });
      setLog(
        res?.data?.data?.map((item) => {
          return {
            ...item,
            hoTen: item?.nguoiDung?.hoTen,
          };
        }),
      );
    } catch (error) {}
  };

  const KSDD = KSDXData?.kySoBuocDuyets?.find(i => i?.ma_NguoiKy === nguoiDung?.ma_NguoiDung);
  return (
    <>
      <Modal
        footer={null}
        open={!!log}
        title="Lịch sử"
        onCancel={() => setLog(null)}
        onOk={() => setLog(null)}>
        <Table columns={columns_33} dataSource={log} pagination={{defaultPageSize: 5}} />
      </Modal>

      <Modal
        width={550}
        title={"Cấu hình QR"}
        open={modalCauHinhQr}
        onOk={() => {}}
        onCancel={() => {
          // setModalPasscodeVisible(false);
          // formPasscode.resetFields();
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
                loading={submitPasscodeLoading}
                type="primary"
                htmlType="submit">
                Đồng ý
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        title={"Nhập passcode để ký"}
        open={modalPasscodeVisible}
        onOk={() => {}}
        onCancel={() => {
          setModalPasscodeVisible(false);
          formPasscode.resetFields();
        }}
        footer={null}>
        <Form
          form={formPasscode}
          name="suathongso"
          onFinish={handleKiemTraPasscode}
          autoComplete="off">
          <Form.Item
            labelCol={{
              span: 5,
            }}
            label="Passcode"
            name="passcode"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập passcode!",
              },
            ]}>
            <Input.Password autoFocus />
          </Form.Item>

          <div className="d-flex justify-content-center gap-3 mt-2">
            <Form.Item>
              <Button
                type="ghost"
                htmlType="button"
                onClick={() => setModalPasscodeVisible(false)}>
                Bỏ qua
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                loading={submitPasscodeLoading}
                type="primary"
                htmlType="submit">
                Đồng ý
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        title={"Sửa ký số đề xuất"}
        open={modalDeXuatVisible}
        onOk={() => {}}
        onCancel={() => {
          setModalDeXuatVisible(false);
          form.resetFields();
        }}
        footer={null}>
        <Form
          form={formDeXuat}
          name="suathongso"
          onFinish={handleSuaDeXuat}
          autoComplete="off">
          <Form.Item
            labelCol={{
              span: 5,
            }}
            label="Trích yếu"
            name="ten_DeXuat"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trích yếu!",
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 5,
            }}
            label="Loại văn bản"
            name="loaiVanBan">
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 5,
            }}
            label="Ghi chú"
            name="ghiChu">
            <TextArea cols={10} />
          </Form.Item>

          <div
            className="ms-3 d-flex flex-column"
            style={{ marginTop: -10 }}
            onClick={() => {
              setFile(null);
              inputFileRef.current?.click();
            }}>
            <div className="d-flex align-items-center">
              <Button
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

          <div className="d-flex justify-content-center gap-3 mt-2">
            <Form.Item>
              <Button
                type="ghost"
                htmlType="button"
                onClick={() => setModalDeXuatVisible(false)}>
                Bỏ qua
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                loading={suaDeXuatLoading || uploading}
                type="primary"
                htmlType="submit">
                Đồng ý
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        title={"Thêm trao đổi"}
        open={modalTraoDoiVisible}
        onOk={() => {}}
        onCancel={() => {
          setModalTraoDoiVisible(false);
          formTraoDoi.resetFields();
        }}
        footer={null}>
        <Form
          form={formTraoDoi}
          name="suathongso"
          onFinish={handleAddTraoDoi}
          autoComplete="off">
          <Form.Item
            labelCol={{
              span: 5,
            }}
            label="Nội dung"
            name="y_Kien"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trao đổi!",
              },
            ]}>
            <Input autoFocus />
          </Form.Item>

          <div
            className="ms-3 d-flex flex-column"
            style={{ marginTop: -10 }}
            onClick={() => {
              setFileTraoDoi(null);
              inputTraoDoiRef.current?.click();
            }}>
            <div className="d-flex align-items-center">
              <Button
                className="d-flex align-items-center"
                type="link"
                icon={<CloudUploadOutlined />}>
                Đính kèm file
              </Button>

              {fileTraoDoiName}
            </div>

            {!!fileError && (
              <div className="ms-3 ant-form-item-explain-error">
                {fileTraoDoiError}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-center gap-3 mt-2">
            <Form.Item>
              <Button
                type="ghost"
                htmlType="button"
                onClick={() => setModalTraoDoiVisible(false)}>
                Bỏ qua
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                loading={addTraoDoiLoading || uploadingTraoDoi}
                type="primary"
                htmlType="submit">
                Đồng ý
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <ModalBuocDuyet
        visible={modalBuocDuyetVisible}
        loading={themBuocLoading}
        onSubmit={handleThemBuocDuyet}
        dsNguoiDungDuyet={dsNguoiDungDuyet}
        onClose={() => setModalBuocDuyetVisible(false)}
      />
      <input
        style={{ position: "absolute", left: "-100vw" }}
        className="input-file"
        ref={inputFileRef}
        type="file"
        accept="application/pdf"
        multiple={false}
        onChange={async (e) => {
          if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = e.target.files;
            const file = selectedFiles[0];

            if (file.type !== "application/pdf") {
              setFileError("Vui lòng chọn file pdf");
            } else {
              setFile(file);
              setFileName(file.name);
            }
          }
        }}
      />

      <input
        style={{ position: "absolute", left: "-100vw" }}
        className="input-file"
        ref={inputTraoDoiRef}
        type="file"
        // accept="application/pdf"
        multiple={false}
        onChange={async (e) => {
          if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = e.target.files;
            const file = selectedFiles[0];

            if (
              !file.type.includes("application/pdf") &&
              !file.type.includes(
                "vnd.openxmlformats-officedocument.wordprocessingml.document",
              ) &&
              !file.type.includes("application/msword") &&
              !file.type.includes("image/png") &&
              !file.type.includes("image/jpeg")
            ) {
              setFileTraoDoiError("Vui lòng chọn file pdf, word hoặc ảnh");
            } else {
              setFileTraoDoi(file);
              setFileTraoDoiName(file.name);
            }
          }
        }}
      />

      <div>
        <Button
          type="link"
          className="ms-3 mt-3"
          onClick={() => {
            // setCurrentUserDetail(null);
            navigate("/" + TAB.KI_DE_XUAT);
          }}>
          Trở lại danh sách
        </Button>

        <div className="d-flex justify-content-center">
          {!daChuyenDuyet && (
            <>
              <Popconfirm
                title="Bạn có chắc chắn muốn chuyển duyệt đề xuất?"
                onConfirm={handleChuyenDuyet}
                okText="Đồng ý"
                cancelText="Thoát">
                <Button
                  className="d-flex align-items-center text-black"
                  type="link"
                  loading={chuyenDuyetLoading}
                  disabled={dsBuocDuyet.length === 0}
                  icon={<ScheduleOutlined />}>
                  Chuyển duyệt
                </Button>
              </Popconfirm>
              <Button
                onClick={() => setModalDeXuatVisible(true)}
                className="d-flex align-items-center text-black"
                type="link"
                icon={<EditOutlined />}>
                Sửa đề xuất
              </Button>

              {/* <Button
                onClick={() => {
                  setModalCauHinhQr(true)
                }}
                className="d-flex align-items-center text-black"
                type="link"
                icon={<AiOutlineSetting />}>
                Cấu hình QR
              </Button> */}

              <Button
                className="d-flex align-items-center text-black"
                type="link"
                disabled={KSDXData?.isQR}
                onClick={() => {
                  localStorage.setItem('gan-ma-qr', KSDXData?.inputFile)
                  navigate('/' + TAB.GAN_MA_QR + '/' + KSDXData?.ma_KySoDeXuat)

                }}
                
                icon={<AiOutlineQrcode />}>
                Gắn mã QR
              </Button>

              <Popconfirm
                title="Bạn có chắc chắn muốn xoá?"
                onConfirm={() => handleXoaDeXuat()}
                okText="Đồng ý"
                cancelText="Thoát">
                <Button
                  onClick={() => {
                    setModalVisible(true);
                    setModalType(PASSCODE);
                  }}
                  className="d-flex align-items-center text-black"
                  type="link"
                  icon={<DeleteOutlined />}>
                  Xoá đề xuất
                </Button>
              </Popconfirm>
            </>
          )}

          {pageChiTietKyChoDuyet && (
            <>
              {isNguoiKyHienTai && !buocDuyetHienTai?.isDaKy && (
                <>
                  <Button
                    onClick={() => {
                      setModalPasscodeVisible(true);
                    }}
                    className="d-flex align-items-center text-black"
                    type="link"
                    icon={<EditTwoTone twoToneColor="blue" />}>
                    Ký duyệt
                  </Button>
                  <Popconfirm
                    title="Bạn có chắc chắn muốn từ chối đề xuất?"
                    onConfirm={() => handleTuChoi()}
                    okText="Đồng ý"
                    cancelText="Thoát">
                    <Button
                      className="d-flex align-items-center text-black"
                      type="link"
                      loading={chuyenDuyetLoading}
                      disabled={dsBuocDuyet.length === 0}
                      icon={<CloseCircleTwoTone twoToneColor="red" />}>
                      Từ chối
                    </Button>
                  </Popconfirm>
                </>
              )}
            </>
          )}

          <Button
            onClick={() => logDeXuat(KSDXData?.ma_KySoDeXuat)}
            className="d-flex align-items-center text-black"
            type="link"
            icon={<HistoryOutlined />}>
            Lịch sử
          </Button>
        </div>

        <div className="mt-2" style={{ paddingInline: 40 }}>
          <Row label="Trích yếu">
            <div className="d-flex align-items-center">
              <div>{KSDXData?.ten_DeXuat}</div>
            </div>
          </Row>

          <Row label="Loại văn bản" even={false}>
            <div className="d-flex align-items-center">
              <div>{KSDXData?.loaiVanBan}</div>
            </div>
          </Row>

          <Row label="Trạng thái">
            {KSDXData?.trangThai ? "Đang hiệu lực" : "Không hiệu lực"}
          </Row>
        </div>

        <div style={{paddingInline: 20}}>
        <div style={{ marginTop: 20, fontSize: 16, fontWeight: 'bold' }}>File gốc</div>

          <Table
            style={
              {
              }
            }
            loading={false}
            columns={columns}
            dataSource={[KSDXData]}
            // pagination={{ defaultPageSize: 5 }}
            pagination={false}
          />
        </div>
        
        {(!!KSDXData?.fileDaKy || !!KSDD?.fileDaKy) && <div style={{paddingInline: 20}}>
          <div style={{ marginTop: 20, fontSize: 16, fontWeight: 'bold' }}>File đã ký</div>

          <Table
            style={
              {
              }
            }
            loading={false}
            columns={columns_daky}
            dataSource={[KSDXData]}
            pagination={false}
          />
        </div>}

        <div className="d-flex gap-4 mt-4">
          <div className="" style={{ width: "50%" }}>
            {!KSDXData?.trangThai && <Button
              onClick={() => {
                setModalBuocDuyetVisible(true);
              }}
              className="d-flex align-items-center text-black"
              type="link"
              icon={<PlusCircleOutlined />}>
              Thêm bước
            </Button>}

            {dsBuocDuyet.map((item, index) =>
              //
              //

              {
                const bg =
                  item?.trangThai === true
                    ? "green"
                    : KSDXData?.curentOrder === item?.order &&
                      KSDXData?.trangThai === true
                    ? "orange"
                    : "gray";
                return (
                  <div
                    key={index}
                    style={{
                      paddingLeft: 20,
                      borderTop: "1px solid gray",
                      paddingTop: 20,
                      paddingBottom: 20,
                    }}>
                    <div
                      style={{
                        height: 40,
                        background: bg,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 10,
                        borderRadius: 5,
                      }}>
                      {item?.order}. {item?.ten_Buoc}
                    </div>
                    {renderRow(
                      item,
                      bg,
                      KSDXData?.curentOrder === item?.order &&
                        KSDXData?.trangThai === true,
                    )}
                  </div>
                );
              },
            )}
          </div>

          <div className=" pe-4" style={{ width: "50%" }}>
            <div className="d-flex align-items-center justify-content-between">
              <div
                style={
                  {
                    // borderBottom: "1px solid gray",
                  }
                }>
                Trao đổi
              </div>

              <Button
                type="primary"
                onClick={() => setModalTraoDoiVisible(true)}>
                Trao đổi
              </Button>
            </div>

            <div className="mt-2 mb-5">
              {listTraoDoi.map((item, index) => {
                return (
                  <div
                  style={{ border: "1px solid #f0f0f0", padding: "10px 20px" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div
                      style={{
                        fontSize: 16,
                        color: "blue",
                      }}>
                      {item?.nguoiDung?.hoTen}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <div>{moment(item?.thoiGian).fromNow()}</div>

                     {item?.ma_NguoiDung === nguoiDung?.ma_NguoiDung && <Popconfirm
                        title="Bạn có chắc chắn muốn xoá?"
                        onConfirm={() => handleXoaTraoDoi(item)}
                        okText="Đồng ý"
                        cancelText="Thoát">
                        <Button type="link" icon={<DeleteOutlined />}></Button>
                      </Popconfirm>}
                    </div>
                  </div>

                  <div className="mt-1">{item?.y_Kien}</div>

                  {!!item?.fileDinhKem && (
                    <div
                      onClick={() => {
                        window.open(item?.fileDinhKem, '_BLANK')
                      }}
                      className="d-flex align-items-center gap-2"
                      style={{ cursor: "pointer" }}>
                      <FileTwoTone twoToneColor={"blue"} />
                      <div style={{ fontStyle: "italic", fontSize: 12 }}>
                        {item?.fileDinhKem}
                      </div>
                    </div>
                  )}
                </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KiSoChiTiet;

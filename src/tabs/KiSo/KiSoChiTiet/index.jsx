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
  CloseCircleTwoTone
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
  xoaBuocDuyetSvc,
  xoaKSDX,
} from "../../../store/kysodexuat/service";
import { useParams } from "react-router-dom";
import ModalBuocDuyet from "./ModalBuocDuyet";
import { kiemTraPasscodeSvc } from "../../../store/kyso/services";
import { useSelector } from "react-redux";
import { nguoiDungSelector } from "../../../store/auth/selectors";
import { logDeXuatSvc } from "../../../store/log/service";
import moment from "moment";
import {API_DOMAIN} from '../../../configs/api'
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

  const nguoiDung = useSelector(nguoiDungSelector)
  const pageChiTietKyChoDuyet = location.pathname.includes('ki-cho-duyet/detail')

  const data = null;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(CAU_HINH);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");

  const [KSDXData, setKSDXData] = useState(null);
  const [dsBuocDuyet, setDsBuocDuyet] = useState([]);
  const [dsNguoiDungDuyet, setDsNguoiDungDuyet] = useState([]);
  const [themBuocLoading, seThemBuocLoading] = useState(false);
  const [modalBuocDuyetVisible, setModalBuocDuyetVisible] = useState(false);
  const [modalPasscodeVisible, setModalPasscodeVisible] = useState(false)

  const [suaDeXuatLoading, setSuaDeXuatLoading] = useState(false);
  const [chuyenDuyetLoading, setChuyenDuyetLoading] = useState(false)
  const [submitPasscodeLoading, setSubmitPasscodeLoading] = useState(false)

  const daChuyenDuyet = KSDXData?.trangThai;

  const buocDuyetHienTai = KSDXData?.kySoBuocDuyets?.find(item => item?.order === KSDXData?.curentOrder)

  const isNguoiKyHienTai = buocDuyetHienTai?.ma_NguoiKy === nguoiDung?.ma_NguoiDung


  const {
    percent,
    uploading,
    uploadFile: uploadToFireBase,
    url,
    resetFile,
  } = useUploadFileToFireBase({ file });

  const inputFileRef = useRef();

  const [form] = Form.useForm();
  const [formDeXuat] = Form.useForm();
  const [formPasscode] = Form.useForm();

  const handleKiemTraPasscode = async values => {
    const data = {
      ma_NguoiKy: nguoiDung?.ma_NguoiDung,
      passcode: values?.passcode
    }

    try {
      setSubmitPasscodeLoading(true);

      const res = await kiemTraPasscodeSvc(data);

      console.log(KSDXData)

      if(res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        localStorage.setItem('ki-that', KSDXData?.inputFile)
        navigate("/ki-cho-duyet/ki-that/" + buocDuyetHienTai?.ma_BuocDuyet);
      } else {
        message.error(res.data?.retText)
      }
    } catch (error) {
      //message.error(LOI_HE_THONG)
    } finally {
      setSubmitPasscodeLoading(false)
    }
  }

  const getKSDX = async () => {
    try {
      const res = await getKSDXSvc({ id: params?.id });

      const data = res.data?.data;
      // console.log(data)
      setKSDXData({...data, tenFile: data?.inputFile, nguoiTao: data?.nguoiDung?.hoTen});

      formDeXuat.setFieldValue("ten_DeXuat", data?.ten_DeXuat);
      formDeXuat.setFieldValue("loaiVanBan", data?.loaiVanBan);
      formDeXuat.setFieldValue("ghiChu", data?.ghiChu);
    } catch (error) {
      console.log(error)
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
            trangThai: item?.isDaKy
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
        message.error(res.data?.retText)
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
        message.success(res.data?.retText)
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

  const [modalDeXuatVisible, setModalDeXuatVisible] = useState(false);

  const handleSuaDeXuat = async (values) => {
    if (!file) return setFileError(" Vui lòng nhập chọn file");

    const data = {
      ...values,
      inputFile: url || KSDXData?.inputFile,
      ma_NguoiDeXuat: KSDXData?.ma_NguoiDeXuat,
      ma_KySoDeXuat: KSDXData?.ma_KySoDeXuat,
      ten_FileGoc: fileName
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

  const handleChuyenDuyet =  async () => {
    setChuyenDuyetLoading(true)
    try {
      const res = await chuyenDuyetSvc({id: KSDXData?.ma_KySoDeXuat})

      if(res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        getKSDX();
    getDsBuocDuyet();
    getDsNguoiDungDuyet();
        message.success(res.data?.retText)
      } else {
        message.error(res.data?.retText)
      }
    } catch (error) {
      //message.error(LOI_HE_THONG)
    } finally {
      setChuyenDuyetLoading(false)
    }

  }

  useEffect(() => {
    if (file) {
      uploadToFireBase();
      setFileError("");
    }
  }, [file]);

  useEffect(() => {
    getKSDX();
    getDsBuocDuyet();
    getDsNguoiDungDuyet();
  }, []);

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
          <div onClick={() => {
            // window.open(_)
            window.open(API_DOMAIN + _, '_BLANK')
          }} className="d-flex align-items-center gap-2" style={{flex: 1}}>
          {_?.split('files%')?.[1]?.split('?alt')?.[0]}
          <FilePdfTwoTone twoToneColor={'red'} />
         </div>
        )
      }
    },
    {
      title: "Người tạo",
      dataIndex: "nguoiTao",
      key: "nguoiTao",
    },
    {
      title: "Ký số",
      dataIndex: "kiSo",
      key: "kiSo",
      render: (_, record) => (
        <div>
          <Checkbox checked={_} />
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (_, record) => (
        <div>
          <Checkbox checked={_} />
        </div>
      ),
    },
  ];

  const renderRow = (item, bg = 'gray') => {
    return (
      <div className="d-flex">
        <div className="py-1" style={{width: 40}}>
          <div className="text-center">STT</div>
          <div className="text-center" style={{background: bg, borderRadius: 5, color: '#fff', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{item?.order}</div>
        </div>

        <div className="flex-grow-1 ps-3 py-1">
          <div>Người duyệt</div>
          <div style={{height: 40, display: 'flex', alignItems: 'center'}}>{item?.hoTen}</div>
        </div>

        <div  className="py-1" >
          <div>Trạng thái</div>
          <div style={{height: 40, display: 'flex', alignItems: 'center'}} className="d-flex align-items-center gap-2">
            {item?.trangThai ? (
              <>
                <CheckCircleTwoTone twoToneColor="#52c41a" />
                <div>Đã thực hiện</div>
              </>
            ) : (
              <>
                <ClockCircleTwoTone />
                <div>Chưa thực hiện</div>
              </>
            )}
        </div>
        </div>

        {!daChuyenDuyet && <div className="ms-2">
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
        </div>}
      </div>
    )
  }

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
        return <>{moment(_).format('DD-MM-YYYY')}</>
      }
    },
  ];
  const [log, setLog] = useState(null)
  const logDeXuat = async (id) => {
    try {
      const res = await logDeXuatSvc({id})
      setLog(res?.data?.data?.map(item => {
        return {
          ...item,
          hoTen: item?.nguoiDung?.hoTen,
        }
      }))
    } catch (error) {
      
    }
  }
  return (
    <>
    <Modal footer={null} open={!!log} title='Lịch sử' onCancel={() => setLog(null)} onOk={() => setLog(null)}>
        <Table
          columns={columns_33}
          dataSource={log}
        />
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

          {
            pageChiTietKyChoDuyet && 
            <>
            {
              isNguoiKyHienTai && 
              <>
               <Button
                onClick={() => {
                    setModalPasscodeVisible(true)
                }}
                className="d-flex align-items-center text-black"
                type="link"
                icon={<EditTwoTone twoToneColor='blue' />}>
                Ký duyệt
              </Button>
              <Popconfirm
                title="Bạn có chắc chắn muốn từ chối đề xuất?"
                onConfirm={() => {

                }}
                okText="Đồng ý"
                cancelText="Thoát">
                <Button
                  className="d-flex align-items-center text-black"
                  type="link"
                  loading={chuyenDuyetLoading}
                  disabled={dsBuocDuyet.length === 0}
                  icon={<CloseCircleTwoTone twoToneColor='red' />}>
                  Từ chối
                </Button>
              </Popconfirm>
              </>
            }
            
             
            </>
          }

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

        <Table
          style={{
            marginTop: 20,
          }}
          loading={false}
          columns={columns}
          dataSource={[KSDXData]}
          pagination={{ defaultPageSize: 5 }}
        />

        <div className="d-flex">
          <div className="flex-grow-1">
            <Button
              onClick={() => {
                setModalBuocDuyetVisible(true);
              }}
              className="d-flex align-items-center text-black"
              type="link"
              icon={<PlusCircleOutlined />}>
              Thêm bước
            </Button>

            {dsBuocDuyet.map(
              (item, index) => 
              //
  // 

            {
              const bg= item?.trangThai === true ? 'blue' : ( KSDXData?.curentOrder === item?.order ? 'green' : 'gray'); 
              return (
                <div key={index} style={{paddingLeft: 20, borderTop: '1px solid gray', paddingTop: 20, paddingBottom: 20}}>
                <div style={{
                  height: 40,
                  background: bg,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 10,
                  borderRadius: 5
                }}>{item?.order}. {item?.ten_Buoc}</div>
                {renderRow(item, bg)}
              </div>
              )
            }
            )}
          </div>

          <div className="flex-grow-1">
            <div>Trao đổi</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KiSoChiTiet;

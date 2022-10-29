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
  suaCauHinhPfxSvc,
  suaPasscodeSvc,
} from "../../../store/kyso_thongso/services";
import { transformUser } from "../../../utils/user";
import { useNavigate } from "react-router-dom";
import * as TAB from "../../../constants/tab";
import {
  getDsBuocDuyetSvc,
  getKSDXSvc,
  themBuocDuyetSvc,
  xoaBuocDuyetSvc,
} from "../../../store/kysodexuat/service";
import { useParams } from "react-router-dom";
import ModalBuocDuyet from "./ModalBuocDuyet";

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

  const {
    percent,
    uploading,
    uploadFile: uploadToFireBase,
    url,
    resetFile,
  } = useUploadFileToFireBase({ file });

  const inputFileRef = useRef();

  const [form] = Form.useForm();

  const getKSDX = async () => {
    try {
      const res = await getKSDXSvc({ id: params?.id });

      setKSDXData(res.data?.data);
    } catch (error) {
      message.error(LOI);
    } finally {
    }
  };

  const getDsBuocDuyet = async () => {
    try {
      const res = await getDsBuocDuyetSvc({ id: params?.id });

      console.log(res.data?.data);
      setDsBuocDuyet(
        res.data?.data?.map((item, index) => {
          return {
            ...item,
            stt: index + 1,
          };
        }),
      );
    } catch (error) {
      message.error(LOI);
    } finally {
    }
  };

  const getDsNguoiDungDuyet = async () => {
    try {
      const res = await getListNguoiDungDuyetSvc();

      setDsNguoiDungDuyet(res.data?.data);
    } catch (error) {
      message.error(LOI);
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

      // console.log(data);
      const res = await themBuocDuyetSvc(data);

      // console.log(res.data);
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        getDsBuocDuyet();
      }
      // if(res.status === SUCCESS )
    } catch (error) {
    } finally {
      seThemBuocLoading(false);
      setModalBuocDuyetVisible(false);
    }
  };

  const handleXoaBuocDuyet = async (buocduyet) => {
    // console.log(buocduyet);
    try {
      const res = await xoaBuocDuyetSvc({ id: buocduyet?.ma_BuocDuyet });

      console.log(res.data);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        getDsBuocDuyet();
      }
    } catch (error) {
      message.error(LOI);
    }
  };

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
      render: (_, record) => (
        <div className="d-flex align-items-center gap-2">
          {/* <Checkbox checked={_} /> */}
          {_}
          <FilePdfOutlined />
        </div>
      ),
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

  const columns_2 = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Người duyệt",
      dataIndex: "hoTen",
      key: "hoTen",
    },

    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (_, record) => <div>{_ ? "Đã thực hiện" : "Chưa thực hiện"}</div>,
    },

    {
      title: "",
      dataIndex: "hanhDong",
      key: "hanhDong",
      render: (_, record) => (
        // <div>
        //   <Button icon={<DeleteOutlined />} />
        // </div>
        <Popconfirm
          title="Bạn có chắc chắn muốn xoá?"
          onConfirm={() => handleXoaBuocDuyet(record)}
          okText="Đồng ý"
          cancelText="Thoát">
          <Button icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
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
          <Button
            // onClick={() => handleShowModalEdit(data)}
            className="d-flex align-items-center text-black"
            type="link"
            icon={<ScheduleOutlined />}>
            Chuyển duyệt
          </Button>
          <Button
            // onClick={() => handleShowModalEdit(data)}
            className="d-flex align-items-center text-black"
            type="link"
            icon={<EditOutlined />}>
            Sửa đề xuất
          </Button>

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

          <Button
            className="d-flex align-items-center text-black"
            type="link"
            icon={<HistoryOutlined />}>
            Lịch sử
          </Button>

          <Button
            onClick={() => {
              setModalVisible(true);
              setModalType(CAU_HINH);
            }}
            className="d-flex align-items-center text-black"
            type="link"
            icon={<PlusCircleOutlined />}>
            Thêm quy trình
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

          <Row label="Đề xuất" even={false}>
            <div className="d-flex align-items-center">
              <div>{data?.hoTen}</div>
            </div>
          </Row>
        </div>

        <Table
          loading={false}
          columns={columns}
          dataSource={[
            {
              stt: 1,
              tenFile: "Test.pdf",
              nguoiTao: "Nguyen Van A",
              kiSo: true,
            },
            {
              stt: 2,
              tenFile: "Test.pdf",
              nguoiTao: "Nguyen Van A",
              kiSo: false,
            },
          ]}
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

            <Table
              loading={false}
              columns={columns_2}
              // dataSource={[
              //   {
              //     stt: 1,
              //     nguoiDuyet: "Nguyen Van A",
              //     trangThai: true,
              //   },
              // ]}
              dataSource={dsBuocDuyet}
              pagination={{ defaultPageSize: 5 }}
            />
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

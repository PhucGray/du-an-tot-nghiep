import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Table, Button, message, Popconfirm, DatePicker } from "antd";
import useUploadFileToFireBase from "../../../hooks/useUploadFileToFireBase";
import { PlusOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { nguoiDungSelector } from "../../../store/auth/selectors";
import { RETCODE_SUCCESS, SUCCESS } from "../../../constants/api";
import {toLowerCaseNonAccentVietnamese} from '../../../utils/strings'
import {
  getListVanBan,
  suaVanBanSvc,
  themVanBanSvc,
  xoaVanBanSvc,
} from "../../../store/vanban/services";
import moment from "moment";
import { AiOutlineFile } from "react-icons/ai";
import { API_DOMAIN } from "../../../configs/api";
import { useMemo } from "react";
import { useNavigate, useRoutes, useLocation } from "react-router-dom";
import { themKSDXTaoVanBanSvc } from "../../../store/kysodexuat/service";
const { TextArea } = Input;

const VanBan = () => {
  const navigate = useNavigate()
  const nguoiDung = useSelector(nguoiDungSelector);
  const location = useLocation()

  const vanBanCanTao = location.state?.record || null;
  const isTaoVanBan = !!vanBanCanTao;


  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [fileName, setFileName] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [getListLoading, setGetListLoading] = useState(false);
  const [editedVanBan, setEditedVanBan] = useState(null);
  const [fileType, setFileType] = useState(0);

  const [list, setList] = useState([]);
  const [searchList, setSearchList] = useState([])
  const [keywordChuDe, setKeywordChuDe] = useState('')
  const [keywordLoaiVanBan, setKeywordLoaiVanBan] = useState('')
  const [keywordMaSo, setKeywordMaSo] = useState('');

  useEffect(() => {
    if(!!keywordChuDe.trim() || !!keywordLoaiVanBan.trim() || !!keywordMaSo.trim()) {
      // console.log(keywordMaSo)
      // console.log(list.map(i => i?.ma_VanBan))
      setSearchList(list.filter(i => 
        toLowerCaseNonAccentVietnamese(i?.chuDe).includes(keywordChuDe) &&
        toLowerCaseNonAccentVietnamese(i?.loaiVanBan).includes(keywordLoaiVanBan) &&
        toLowerCaseNonAccentVietnamese(i?.ma_VanBan?.toString()).includes(keywordMaSo)
        ))
    }
  }, [keywordChuDe, keywordLoaiVanBan, keywordMaSo]);

  useEffect(() => {
    if(isTaoVanBan) {
      setIsModalOpen(true)
      form.setFieldValue('chuDe', vanBanCanTao?.ten_DeXuat)
      form.setFieldValue('loaiVanBan', vanBanCanTao?.loaiVanBan)
    }
  }, [isTaoVanBan]);

  const [form] = Form.useForm();

  const {
    percent,
    uploading,
    uploadFile: uploadToFireBase,
    url,
    resetFile,
  } = useUploadFileToFireBase({ file });
  const inputFileRef = useRef();

  const handleSearch = (keyword) => {
    setKeyword(keyword);

    // setSearchList(
    //   [...listUser].filter((i) =>
    //     toLowerCaseNonAccentVietnamese(i?.itemName).includes(
    //       toLowerCaseNonAccentVietnamese(keyword),
    //     ),
    //   ),
    // );
  };

  const handleGetList = async () => {
    setGetListLoading(true);
    try {
      const res = await getListVanBan();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setList(
          res.data?.data?.map((item, index) => ({ ...item, stt: index + 1 })),
        );
      }
    } catch (error) {
    } finally {
      setGetListLoading(false);
    }
  };

  const handleThemVanBan = async (values) => {
    setAddLoading(true);
    try {
      let data;
      if (url) {
        data = {
          ...values,
          ma_NguoiTao: nguoiDung?.ma_NguoiDung,
          file: url,
          ten_FileGoc: fileName,
          ngay_HieuLuc: moment(values?.ngay_HieuLuc).format()
        };
      } else {
        data = {
          ...values,
          ma_NguoiTao: nguoiDung?.ma_NguoiDung,
          ten_FileGoc: fileName,
          ngay_HieuLuc: moment(values?.ngay_HieuLuc).format()
        };
      }

      const res = await themVanBanSvc(data);
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        form.resetFields();
        setFile(null);
        resetFile();
        setFileName("");
        setIsModalOpen(false);
        inputFileRef.current.value = null;
        handleGetList();
      } else {
      }
    } catch (error) {
    } finally {
      setAddLoading(false);
    }
  };
  const handleThemTaoVanBan = async (values) => {
    setAddLoading(true);
    try {
      let data ={
        ...values,
        ma_NguoiTao: nguoiDung?.ma_NguoiDung,
        file: vanBanCanTao?.fileDaKy,
        ten_FileGoc: vanBanCanTao?.ten_FileGoc,
        ngay_HieuLuc: moment(values?.ngay_HieuLuc).format()
      }
      

      const res = await themKSDXTaoVanBanSvc(data);
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        form.resetFields();
        setIsModalOpen(false);
        handleGetList();
      } else {
      }
    } catch (error) {
    } finally {
      setAddLoading(false);
    }
  };

  const handleSuaVanBan = async (values) => {
    setAddLoading(true);
    try {
      let data;
      if (url) {
        data = {
          ...values,
          ma_NguoiTao: nguoiDung?.ma_NguoiDung,
          file: url,
          ma_VanBan: editedVanBan?.ma_VanBan,
          ten_FileGoc: fileName,
        };
      } else {
        data = {
          ...values,
          ma_NguoiTao: nguoiDung?.ma_NguoiDung,
          ma_VanBan: editedVanBan?.ma_VanBan,
          file: null,
          ten_FileGoc: null,
        };
      }

      console.log(data);

      const res = await suaVanBanSvc(data);

      // console.log(res)
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        form.resetFields();
        setFile(null);
        resetFile();
        setFileName("");
        setIsModalOpen(false);
        inputFileRef.current.value = null;
        handleGetList();
        setEditedVanBan(null);
      } else {
      }
    } catch (error) {
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteVanBan = async (vanban) => {
    // console.log(vanban)
    try {
      const res = await xoaVanBanSvc({ id: vanban?.ma_VanBan });

      handleGetList();
      message.success(res.data?.retText);
    } catch (error) {}
  };

  const columns = [
    // {
    //   title: "STT",
    //   dataIndex: "stt",
    //   key: "stt",
    // },
    {
      title: "M?? s???",
      dataIndex: "ma_VanBan",
      key: "ma_VanBan",
    },
    {
      title: "Ng??y hi???u l???c",
      dataIndex: "ngay_HieuLuc",
      key: "ngay_HieuLuc",
      render: (_, record) => {
        return <>{moment(_).format("DD/MM/YYYY")}</>;
      },
    },
    {
      title: "Ch??? ?????",
      dataIndex: "chuDe",
      key: "chuDe",
    },
    {
      title: "Lo???i v??n b???n",
      dataIndex: "loaiVanBan",
      key: "loaiVanBan",
    },
    {
      title: "T??n file",
      dataIndex: "fileDaKy",
      key: "fileDaKy",
      render: (_, record) => {
        return (
          <>
            {record?.file && <div
            onClick={() => {
              window.open(API_DOMAIN + record?.file);
            }}
            className="d-flex align-items-center gap-2"
            style={{ flex: 1, cursor: "pointer" }}>
            <AiOutlineFile size={30} style={{ color: "blue" }} />
            {record?.ten_FileGoc}
          </div>}
          </>
        );
      },
    },
    {
      title: "H??nh ?????ng",
      key: "hanhDong",
      render: (_, record) => (
        <div>
          {nguoiDung?.isVanBan && (
            <div>
              <Button
                onClick={() => {
                  setEditedVanBan(record);
                  form.setFieldValue("chuDe", record?.chuDe);
                  form.setFieldValue("loaiVanBan", record?.loaiVanBan);
                  form.setFieldValue('nguoiKy', record?.nguoiKy)
                  form.setFieldValue('ngay_HieuLuc', moment(record?.ngay_HieuLuc))
                }}
                type="link">
                S???a
              </Button>
              <Button
                onClick={() => {
                  navigate('detail/' + record?.ma_VanBan)
                  // setEditedVanBan(record);
                  // form.setFieldValue("chuDe", record?.chuDe);
                  // form.setFieldValue("loaiVanBan", record?.loaiVanBan);
                  // form.setFieldValue('nguoiKy', record?.nguoiKy)
                  // form.setFieldValue('ngay_HieuLuc', moment(record?.ngay_HieuLuc))
                }}
                type="link">
                Chi ti???t
              </Button>
              <Popconfirm
                title="B???n c?? ch???c ch???n mu???n xo???"
                onConfirm={() => handleDeleteVanBan(record)}
                okText="?????ng ??"
                cancelText="Tho??t">
                <Button type="link">Xo??</Button>
              </Popconfirm>
            </div>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (file) {
      uploadToFireBase();
      setFileError(false);
    }
  }, [file]);

  useEffect(() => {
    if (url) {
      setFile(null);
    }
  }, [url]);

  useEffect(() => {
    handleGetList();
  }, []);

  return (
    <div>
      <input
        style={{ position: "absolute", left: "-100vw" }}
        className="input-file"
        ref={inputFileRef}
        type="file"
        // accept="application/pdf"
        multiple={false}
        onChange={async (e) => {
          // console.log('chay 1111')
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
              setFileError("Vui l??ng ch???n file pdf, word ho???c ???nh");
            } else {
              setFile(file);
              setFileName(file.name);
            }
          }
        }}
      />

      <Modal
        title={!!editedVanBan ? 'S???a v??n b???n' : "Th??m v??n b???n"}
        open={isModalOpen || !!editedVanBan}
        onOk={() => {}}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditedVanBan(null);
        }}
        footer={null}>
        <Form
          form={form}
          name="suathongso"
          onFinish={!!editedVanBan ? handleSuaVanBan : (isTaoVanBan ? handleThemTaoVanBan : handleThemVanBan)}
          autoComplete="off">
          <Form.Item
            labelCol={{
              span: 6,
            }}
            label="Ch??? ?????"
            name="chuDe"
            rules={[
              {
                required: true,
                message: "Vui l??ng nh???p ch??? ?????!",
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 6,
            }}
            label="Lo???i v??n b???n"
            name="loaiVanBan"
            rules={[
              {
                required: true,
                message: "Vui l??ng nh???p lo???i v??n b???n!",
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 6,
            }}
            label="Ng?????i k??"
            name="nguoiKy"
            rules={[
              {
                required: true,
                message: "Vui l??ng nh???p ng?????i k??!",
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 6,
            }}
            label="Ng??y hi???u l???c"
            name="ngay_HieuLuc"
            rules={[
              {
                required: true,
                message: "Vui l??ng ch???n ng??y hi???u l???c!",
              },
            ]}>
            {<DatePicker format={'DD-MM-YYYY'} />}
          </Form.Item>

          <div
            className="ms-3 d-flex flex-column"
            style={{ marginTop: -10, marginBottom: isTaoVanBan ? 20 : 0 }}
            onClick={() => {
              setFile(null);
              inputFileRef.current?.click();
            }}>
           {!isTaoVanBan && <div className="d-flex align-items-center">
              <Button
                loading={uploading}
                className="d-flex align-items-center"
                type="link"
                icon={<CloudUploadOutlined />}>
                ????nh k??m file
              </Button>

              {fileName}
            </div>}

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
                onClick={() => {setIsModalOpen(false);  setEditedVanBan(null);}}>
                B??? qua
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                loading={addLoading || uploading}
                type="primary"
                htmlType="submit">
                ?????ng ??
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <div className="px-3 mt-5">
        <div className="mt-4 mb-4 d-flex justify-content-between">
          <Input
            style={{ width: 200 }}
            placeholder="Nh???p ch??? ????? c???n t??m"
            value={keywordChuDe}
            onChange={(e) => setKeywordChuDe(e.target.value)}
          />

          <Input
            style={{ width: 200 }}
            placeholder="Nh???p lo???i v??n b???n c???n t??m"
            value={keywordLoaiVanBan}
            onChange={(e) => setKeywordLoaiVanBan(e.target.value)}
          />

          <Input
            style={{ width: 200 }}
            placeholder="Nh???p m?? s??? c???n t??m"
            value={keywordMaSo}
            onChange={(e) => setKeywordMaSo(e.target.value)}
          />

          {nguoiDung?.isVanBan && (
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Th??m v??n b???n
            </Button>
          )}
        </div>
        <Table
          loading={getListLoading}
          columns={columns}
          dataSource={(!!keywordChuDe.trim() || !!keywordLoaiVanBan.trim() || !!keywordMaSo.trim()) ? searchList : list}
          pagination={{ defaultPageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default VanBan;

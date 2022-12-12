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
const { TextArea } = Input;

const VanBan = () => {
  const nguoiDung = useSelector(nguoiDungSelector);

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

  const filteredList = useMemo(() => {
    // return list.filter()
  //   return [...list].filter(
  //     (i) =>
  //   toLowerCaseNonAccentVietnamese(i?.chuDe || '').includes(
  //     toLowerCaseNonAccentVietnamese(keywordChuDe),
  //   ) && 
  //   toLowerCaseNonAccentVietnamese(i?.loaiVanBan || '').includes(
  //     toLowerCaseNonAccentVietnamese(keywordLoaiVanBan),
  //   ) &&
  //   toLowerCaseNonAccentVietnamese(i?.ma_VanBan || '').includes(
  //     toLowerCaseNonAccentVietnamese(keywordMaSo),
  //   )
  // )
  }, [list, keywordChuDe, keywordLoaiVanBan, keywordMaSo])

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
      title: "Mã số",
      dataIndex: "ma_VanBan",
      key: "ma_VanBan",
    },
    {
      title: "Ngày hiệu lực",
      dataIndex: "ngay_HieuLuc",
      key: "ngay_HieuLuc",
      render: (_, record) => {
        return <>{moment(record).format("DD/MM/YYYY")}</>;
      },
    },
    {
      title: "Chủ đề",
      dataIndex: "chuDe",
      key: "chuDe",
    },
    {
      title: "Loại văn bản",
      dataIndex: "loaiVanBan",
      key: "loaiVanBan",
    },
    {
      title: "Tên file",
      dataIndex: "fileDaKy",
      key: "fileDaKy",
      render: (_, record) => {
        // console.log(record)
        return (
          <div
            onClick={() => {
              // window.open(API_DOMAIN +  (pageChiTietKyDaDuyet ? KSDD?.fileDaKy : _ ), "_BLANK");
              window.open(API_DOMAIN + record?.file);
            }}
            className="d-flex align-items-center gap-2"
            style={{ flex: 1, cursor: "pointer" }}>
            {/* {record.ten_FileGoc?.split('.pdf').join('_daky.pdf')} */}
            {/* <FilePdfTwoTone twoToneColor={"red"} /> */}
            <AiOutlineFile size={30} style={{ color: "blue" }} />
            {record?.ten_FileGoc}
          </div>
        );
      },
    },
    {
      title: "Hành động",
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
                }}
                type="link">
                Sửa
              </Button>
              <Popconfirm
                title="Bạn có chắc chắn muốn xoá?"
                onConfirm={() => handleDeleteVanBan(record)}
                okText="Đồng ý"
                cancelText="Thoát">
                <Button type="link">Xoá</Button>
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
              setFileError("Vui lòng chọn file pdf, word hoặc ảnh");
            } else {
              setFile(file);
              setFileName(file.name);
            }
          }
        }}
      />

      <Modal
        title={"Thêm văn bản"}
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
          onFinish={!!editedVanBan ? handleSuaVanBan : handleThemVanBan}
          autoComplete="off">
          <Form.Item
            labelCol={{
              span: 6,
            }}
            label="Chủ đề"
            name="chuDe"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập chủ đề!",
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 6,
            }}
            label="Loại văn bản"
            name="loaiVanBan"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập loại văn bản!",
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 6,
            }}
            label="Người ký"
            name="nguoiKy"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập người ký!",
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 6,
            }}
            label="Ngày hiệu lực"
            name="ngay_HieuLuc"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày hiệu lực!",
              },
            ]}>
            {<DatePicker format={'DD-MM-YYYY'} />}
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
                loading={uploading}
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
                onClick={() => setIsModalOpen(false)}>
                Bỏ qua
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                loading={addLoading || uploading}
                type="primary"
                htmlType="submit">
                Đồng ý
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <div className="px-3 mt-5">
        <div className="mt-4 mb-4 d-flex justify-content-between">
          <Input
            style={{ width: 200 }}
            placeholder="Nhập chủ đề cần tìm"
            value={keywordChuDe}
            onChange={(e) => setKeywordChuDe(e.target.value)}
          />

          <Input
            style={{ width: 200 }}
            placeholder="Nhập loại văn bản cần tìm"
            value={keywordLoaiVanBan}
            onChange={(e) => setKeywordLoaiVanBan(e.target.value)}
          />

          <Input
            style={{ width: 200 }}
            placeholder="Nhập mã số cần tìm"
            value={keywordMaSo}
            onChange={(e) => setKeywordMaSo(e.target.value)}
          />

          {nguoiDung?.isVanBan && (
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Thêm văn bản
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

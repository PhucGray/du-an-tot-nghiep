import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Table, Button, message } from "antd";
import useUploadFileToFireBase from "../../../hooks/useUploadFileToFireBase";
import { PlusOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { nguoiDungSelector } from "../../../store/auth/selectors";
import { RETCODE_SUCCESS, SUCCESS } from "../../../constants/api";
import {themVanBanSvc} from '../../../store/vanban/services'
const {TextArea} = Input 

const VanBan = () => {
  const nguoiDung = useSelector(nguoiDungSelector);

  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState(false);
  const [fileName, setFileName] = useState("");
  const [addLoading, setAddLoading] = useState(false)

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
  
  const handleThemVanBan = async (values) => {
    setAddLoading(true);
    try {
      let data;
      if(url) {
        data = {
          ...values,
          ma_NguoiTao: nguoiDung?.ma_NguoiDung,
          file: url
        }
      } else {
        data = {
          ...values,
          ma_NguoiTao: nguoiDung?.ma_NguoiDung,
        }
      }



      // console.log(data)
      const res = await themVanBanSvc(data)
      console.log(res.data)
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText)
        form.resetFields();
        setFile(null)
        resetFile();
        setFileName('')
        setIsModalOpen(false)
        inputFileRef.current.value = null;
      } else {

      }

      
    } catch (error) {
      
    } 
     finally {
      setAddLoading(false)
     }
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Mã số",
      dataIndex: "maSo",
      key: "maSo",
    },
    {
      title: "Ngày nhận",
      dataIndex: "ngayNhan",
      key: "ngayNhan",
    },
    {
      title: "Chủ đề",
      dataIndex: "chuDe",
      key: "chuDe",
    },
    {
      title: "Loại văn bản",
      dataIndex: "loaiVB",
      key: "loaiVB",
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

            if (!file.type.includes('application/pdf') && 
                !file.type.includes('vnd.openxmlformats-officedocument.wordprocessingml.document') && 
                !file.type.includes('application/msword') && 
                !file.type.includes('image/png') && 
                !file.type.includes('image/jpeg')
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
        open={isModalOpen}
        onOk={() => {}}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}>
        <Form
          form={form}
          name="suathongso"
          onFinish={handleThemVanBan}
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
                message: "Vui lòng nhập trích yếu!",
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
                message: "Vui lòng nhập trích yếu!",
              },
            ]}>
            <Input />
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

      <div className="px-3 mt-3">
        <div className="mt-2 mb-4 d-flex justify-content-between">
          <Input
            style={{ width: 200 }}
            placeholder="Nhập chủ đề cần tìm"
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
          />

          <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm văn bản</Button>
        </div>
        <Table
          columns={columns}
          dataSource={[]}
          pagination={{ defaultPageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default VanBan;

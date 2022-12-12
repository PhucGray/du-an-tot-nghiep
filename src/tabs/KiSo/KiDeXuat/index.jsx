import React, { useEffect } from "react";
import { PlusOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { Button, Tabs, Table, message, Form, Input, Modal, Checkbox } from "antd";
import { useState } from "react";
import moment, { isDate } from "moment";
import {
  getListKSDX_ChoDuyet,
  getListKSDX_ChuaDeXuat,
  getListKSDX_DaDuyet,
  getListKSDX_TuChoi,
  suaKSDXSvc,
  themKSDX,
} from "../../../store/kysodexuat/service";
import {
  LOI,
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../constants/api";
import { nguoiDungSelector } from "../../../store/auth/selectors";
import { useSelector } from "react-redux";
import { useRef } from "react";
import useUploadFileToFireBase from "../../../hooks/useUploadFileToFireBase";

import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const KiDeXuat = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const {
    percent,
    uploading,
    uploadFile: uploadToFireBase,
    url,
    resetFile,
  } = useUploadFileToFireBase({ file });

  const inputFileRef = useRef();
  const nguoiDung = useSelector(nguoiDungSelector);

  const [fileError, setFileError] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeKey, setActiveKey] = useState("1");
  const [getListLoading, setGetListLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const [list_1, setList_1] = useState([]);
  const [list_2, setList_2] = useState([]);
  const [list_3, setList_3] = useState([]);
  const [list_4, setList_4] = useState([]);

  const getList_1 = async () => {
    setGetListLoading(true);
    try {
      const res = await getListKSDX_ChuaDeXuat({ id: nguoiDung?.ma_NguoiDung });
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setList_1(res.data?.data);
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setGetListLoading(false);
    }
  };

  const getList_2 = async () => {
    setGetListLoading(true);
    try {
      const res = await getListKSDX_ChoDuyet({
        id: nguoiDung?.ma_NguoiDung,
      });
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setList_2(res.data?.data);
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setGetListLoading(false);
    }
  };

  const getList_3 = async () => {
    setGetListLoading(true);
    try {
      const res = await getListKSDX_DaDuyet({
        id: nguoiDung?.ma_NguoiDung,
      });
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setList_3(res.data?.data);
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setGetListLoading(false);
    }
  };

  const getList_4 = async () => {
    setGetListLoading(true);
    try {
      const res = await getListKSDX_TuChoi({
        id: nguoiDung?.ma_NguoiDung,
      });
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setList_4(res.data?.data);
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setGetListLoading(false);
    }
  };

  const handleThemDeXuat = async (values) => {
    if (!url) return setFileError(" Vui lòng nhập chọn file");

    const data = {
      ...values,
      inputFile: url,
      ma_NguoiDeXuat: nguoiDung?.ma_NguoiDung,
      ten_FileGoc: fileName,
      isTaoVanBan: false,
    };

    setAddLoading(true);
    try {
      const res = await themKSDX(data);

      if (res.status === SUCCESS && res.data?.retCode) {
        message.success(res.data?.retText);
        form.resetFields();
        setFile(null);
        resetFile();
        setFileName("");
        setIsModalOpen(false);
        inputFileRef.current.value = null;
        getList_1();
        getList_2();
        getList_3();
        getList_4();
        
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setAddLoading(false);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (data, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Trích yếu",
      dataIndex: "ten_DeXuat",
      key: "ten_DeXuat",
    },
    {
      title: "Ngày đề xuất",
      dataIndex: "ngayDeXuat",
      key: "ngayDeXuat",
      render: (data, record, index) => {
        return <div>{moment(data).format("DD-MM-YYYY")}</div>;
      },
    },
    {
      title: "Hành động",
      dataIndex: "hanhDong",
      key: "hanhDong",
      render: (data, record, index) => {
        return (
          // <div className="text-center">{moment(data).format("DD-MM-YYYY")}</div>
          <div
            onClick={() => {
              navigate("detail/" + record.ma_KySoDeXuat);
            }}>
            <Button type="link">Chi tiết</Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getList_1();
    getList_2();
    getList_3();
    getList_4();
  }, []);

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

      <Modal
        title={"Thêm ký số đề xuất"}
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
          onFinish={handleThemDeXuat}
          initialValues={{
            // isTaoVanBan: false
          }}
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

          {/* <Form.Item 
            name="isTaoVanBan" 
            valuePropName="checked"
            labelCol={{
              span: 5,
            }}
            label="Tạo văn bản"
          >
            <Checkbox onChange={(e) => {}}></Checkbox>
          </Form.Item> */}

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

      <div className="d-flex justify-content-center mt-3">
        {nguoiDung?.isDeXuat && <Button
          onClick={() => setIsModalOpen(true)}
          className="d-flex align-items-center"
          type="primary"
          icon={<PlusOutlined />}>
          Thêm đề xuất
        </Button>}
      </div>

      <Tabs
        destroyInactiveTabPane={true}
        defaultActiveKey="1"
        style={{ width: "95%", marginInline: "auto" }}
        onChange={(activeKey) => {
          setActiveKey(activeKey);
        }}>
        <Tabs.TabPane tab={`Ký số chưa đề xuất (${list_1.length})`} key="1">
          <Table
            loading={getListLoading}
            columns={columns}
            dataSource={list_1}
            pagination={{ defaultPageSize: 10 }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={`Ký số đợi duyệt (${list_2.length})`} key="2">
          <Table
            loading={getListLoading}
            columns={columns}
            dataSource={list_2}
            pagination={{ defaultPageSize: 10 }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={`Ký số đã duyệt (${list_3.length})`} key="3">
          <Table
            loading={getListLoading}
            columns={columns}
            dataSource={list_3}
            pagination={{ defaultPageSize: 10 }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={`Từ chối Ký (${list_4.length})`} key="4">
          <Table
            loading={getListLoading}
            columns={columns}
            dataSource={list_4}
            pagination={{ defaultPageSize: 10 }}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default KiDeXuat;

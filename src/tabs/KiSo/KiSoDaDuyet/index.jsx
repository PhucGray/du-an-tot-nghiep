import React, { useEffect } from "react";
import { PlusOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { Button, Tabs, Table, message, Form, Input, Modal, Popconfirm } from "antd";
import { useState } from "react";
import moment, { isDate } from "moment";
import {
  getListKSDX_ChoDuyet,
  getListKSDX_ChuaDeXuat,
  getListKSDX_DaDuyet,
  getListKSDX_TuChoi,
  suaKSDXSvc,
  themKSDX,
  tuChoiKySvc,
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

import { useLocation, useNavigate } from "react-router-dom";
import { getListKySoBuocDuyet, kiemTraPasscodeSvc, getListKySoDaDuyetSvc } from "../../../store/kyso/services";

const { TextArea } = Input;

const KiDeXuat = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const [form] = Form.useForm()

  const nguoiDung = useSelector(nguoiDungSelector);

  const [getListLoading, setGetListLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false)
  const [list, setList] = useState([]);
  const [record, setRecord] = useState(null)

  const g = async () => {
    const res = await getListKySoDaDuyetSvc();

    console.log(res.data?.data)

    setList(
      res.data?.data?.filter(item => item?.ma_NguoiKy === nguoiDung?.ma_NguoiDung)?.map((item, index) => {
        return {
          ...item,
          stt: index + 1,
          ten_DeXuat: item?.kySoDeXuat?.ten_DeXuat,
          nguoiDeXuat: item?.kySoDeXuat?.nguoiDung?.hoTen,
          ngayDeXuat: item?.ngayDeXuat?.ngayDeXuat,
        };
      }),
    );
  };

  const handleKiemTraPasscode = async values => {
    const data = {
      ma_NguoiKy: nguoiDung?.ma_NguoiDung,
      passcode: values?.passcode
    }

    try {
      setSubmitLoading(true);


      const res = await kiemTraPasscodeSvc(data)


      if(res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        localStorage.setItem('ki-that', record?.kySoDeXuat?.inputFile)
        navigate("ki-that/" + record.ma_BuocDuyet);
      } else {
        message.error(res.data?.retText)
      }
    } catch (error) {
      //message.error(LOI_HE_THONG)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleTuChoi= async (record) => {
    try {
      const res = await tuChoiKySvc({id: record?.ma_KySoDeXuat})

      if(res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        g();
        message.success(res.data?.retText)
      } else {
        message.error(res.data?.retText)
      }
    } catch (error) {
      //message.error(LOI_HE_THONG)
    } finally {

    }
  }

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
      title: "Người đề xuất",
      dataIndex: "nguoiDeXuat",
      key: "nguoiDeXuat",
    },
    {
      title: "Ngày đề xuất",
      dataIndex: "ngayDeXuat",
      key: "ngayDeXuat",
      render: (data, record, index) => {
        return (
          <div className="text-center">{moment(data).format("DD-MM-YYYY")}</div>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "hanhDong",
      key: "hanhDong",
      render: (data, record, index) => {
        return (
          <div className="d-flex">
            <div
              onClick={() => {
                navigate('detail/' + record?.ma_KySoDeXuat);
                
              }}>
              <Button type="link">Chi tiết</Button>
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    // getList();
    g();
  }, []);

  return (
    <div className="px-3 mt-3">
      <Modal
        title={"Nhập passcode để ký"}
        open={modalVisible}
        onOk={() => {}}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        footer={null}>
        <Form
          form={form}
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
                onClick={() => setModalVisible(false)}>
                Bỏ qua
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                loading={submitLoading}
                type="primary"
                htmlType="submit">
                Đồng ý
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Table
        loading={getListLoading}
        columns={columns}
        dataSource={list}
        pagination={{ defaultPageSize: 5 }}
      />
    </div>
  );
};

export default KiDeXuat;

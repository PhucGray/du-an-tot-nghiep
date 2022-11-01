import React, { useEffect } from "react";
import { PlusOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { Button, Tabs, Table, message, Form, Input, Modal } from "antd";
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
import { getListKySoBuocDuyet } from "../../../store/kyso/services";

const { TextArea } = Input;

const KiDeXuat = () => {
  const navigate = useNavigate();

  const nguoiDung = useSelector(nguoiDungSelector);

  const [getListLoading, setGetListLoading] = useState(false);

  const [list, setList] = useState([]);

  const getList = async () => {
    setGetListLoading(true);
    try {
      const res = await getListKSDX_ChuaDeXuat({ id: nguoiDung?.ma_NguoiDung });
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        // setList(res.data?.data);
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setGetListLoading(false);
    }
  };

  const g = async () => {
    const res = await getListKySoBuocDuyet();

    setList(
      res.data?.data?.map((item, index) => {
        return {
          stt: index + 1,
          ten_DeXuat: item?.kySoDeXuat?.ten_DeXuat,
          nguoiDeXuat: item?.kySoDeXuat?.nguoiDung?.hoTen,
          ngayDeXuat: item?.ngayDeXuat?.ngayDeXuat,
        };
      }),
    );
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
          // <div className="text-center">{moment(data).format("DD-MM-YYYY")}</div>
          <div
            onClick={() => {
              navigate("detail/" + record.ma_KySoDeXuat);
            }}>
            <Button type="link">Ký</Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getList();
    g();
  }, []);

  return (
    <div>
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

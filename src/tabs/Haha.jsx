import React, { useEffect } from "react";
import { Button, Collapse, Table } from "antd";
import { useState } from "react";
import { getListVanBan } from "../store/vanban/services";
import { RETCODE_SUCCESS, SUCCESS } from "../constants/api";
import moment from "moment";
import { API_DOMAIN } from "../configs/api";
import { AiOutlineFile } from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import { getListKySoBuocDuyet } from "../store/kyso/services";
import { useSelector } from "react-redux";
import { nguoiDungSelector } from "../store/auth/selectors";
import { getListKSDX_ChoDuyet } from "../store/kysodexuat/service";


const { Panel } = Collapse;

const App = () => {
  const navigate = useNavigate()
  const nguoiDung = useSelector(nguoiDungSelector)

  const [listVanBan, setListVanBan] = useState([]);
  const [listChoDuyet, setListChoDuyet] = useState([])
  const [listDeXuat, setListDeXuat] = useState([])

  const handleGetListVanBan = async () => {
    // setGetListLoading(true);
    try {
      const res = await getListVanBan();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setListVanBan(
          res.data?.data?.map((item, index) => ({ ...item, stt: index + 1 })),
        );
      }
    } catch (error) {
    } finally {
      // setGetListLoading(false);
    }
  };

  const handleGetListChoDuyet = async () => {
    const res = await getListKySoBuocDuyet();

    setListChoDuyet(
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

  const handleGetListDeXuat = async () => {
    try {
      const res = await getListKSDX_ChoDuyet({
        id: nguoiDung?.ma_NguoiDung,
      });
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setListDeXuat(res.data?.data);
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      // setGetListLoading(false);
    }
  };

  useEffect(() => {
    handleGetListVanBan()
    handleGetListChoDuyet()
    handleGetListDeXuat()
  }, []);

  const columnsVanBan = [
    {
      title: "Ngày hiệu lực",
      dataIndex: "ngay_HieuLuc",
      key: "ngay_HieuLuc",
      render: (_, record) => {
        return <>{moment(_).format("DD/MM/YYYY")}</>;
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
      title: "Hành động",
      key: "hanhDong",
      render: (_, record) => (
        <div>
           <div>
              <Button
                onClick={() => {
                  navigate('/van-ban/detail/' + record?.ma_VanBan)
                }}
                type="link">
                Chi tiết
              </Button>
            </div>
        </div>
      ),
    },
  ];

  const columnsChoDuyet = [
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
                navigate('ki-cho-duyet/detail/' + record?.ma_KySoDeXuat);
                
              }}>
              <Button type="link">Chi tiết</Button>
            </div>
          </div>
        );
      },
    },
  ];

  const columnsDeXuat = [
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
              navigate("ki-de-xuat/detail/" + record.ma_KySoDeXuat);
            }}>
            <Button type="link">Chi tiết</Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div
        style={{
          marginLeft: 30,
          marginTop: 20,
          marginBottom: 15,
          fontSize: 20,
        }}>
        Trang chủ
      </div>
      <Collapse defaultActiveKey={["1", "2", "3"]} onChange={() => {}}>
        <Panel header="Văn bản" key="1">
          <Table
            bordered={false}
            columns={columnsVanBan}
            dataSource={listVanBan}
            pagination={{ defaultPageSize: 5 }}
          />
        </Panel>
        <Panel header="Ký số đề xuất đang đợi tôi duyệt" key="2">
        <Table
            bordered={false}
            columns={columnsChoDuyet}
            dataSource={listChoDuyet}
            pagination={{ defaultPageSize: 5 }}
          />
        </Panel>
        <Panel header="Ký số đề xuất của tôi chưa được duyệt" key="3">
          <Table
            bordered={false}
            columns={columnsDeXuat}
            dataSource={listDeXuat}
            pagination={{ defaultPageSize: 5 }}
          />
        </Panel>
      </Collapse>
    </>
  );
};
export default App;

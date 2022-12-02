import React, { useEffect, useState } from "react";
import { Input, Table, Button, Modal, Form, Radio, message } from "antd";
import {getListQrSvc, editQr} from '../../../store/maQR/service'
import {SUCCESS, RETCODE_SUCCESS} from '../../../constants/api'
import QRCode from 'qrcode.react';
import moment from "moment";
import { useSelector } from "react-redux";
import { nguoiDungSelector } from "../../../store/auth/selectors";
import { useNavigate } from "react-router-dom";

const MaQR = () => {
  const nguoiDung = useSelector(nguoiDungSelector)
  const navigate = useNavigate()

  const [keyword, setKeyword] = useState("");
  const [list, setList] = useState([])
  const [getListLoading, setGetListLoading] = useState(true);
  const [modalChiTiet, setModalChiTiet] = useState(false);
  const [modalCauHinhQr, setModalCauHinhQr] = useState(false)
  const [chiTiet, setChiTiet] = useState(null)
  const [editLoading, setEditLoading] = useState(false)

  const [formCauHinhQR] = Form.useForm();

  const handleGetList = async  () => {
    setGetListLoading(true)
    try {
      const res = await getListQrSvc()

      if(res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setList(res.data?.data?.map((item, index) => {
          return {
            ...item, 
            stt: index + 1,
            deXuat: item?.kySoDeXuat?.ten_DeXuat,
            trangThai: item?.kySoDeXuat?.trangThai,
          }
        }))
      }
    } catch (error) {
      
    } finally {
      setGetListLoading(false)
    }
  }

  const handleEdit = async () => {
    setEditLoading(true)
    try {
      const res = await editQr({
        maSo: chiTiet?.maSo,
        mucDo: formCauHinhQR.getFieldValue('state')
      })

      if(res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText)
        handleGetList()
        setModalCauHinhQr(false)
      } else {
        message.error(res.data?.retText)
      }
    } catch (error) {
      
    } finally {
      setEditLoading(false)
    }
  }

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

  useEffect(() => {
    handleGetList()
  }, []);

  const handleDownloadQR = () => {
    const canvas = document.querySelector('.download-ne > canvas');
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "imgName" + "-QR.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (_, record) => {
        return (
          <>
            {_ === true && 'Đã ký'}
            {_ === false && 'Chưa ký'}
          </>
        )
      }
    },
    {
      title: "Đề xuất",
      dataIndex: "deXuat",
      key: "deXuat",
    },
    {
      title: "Bảo mật",
      dataIndex: "mucDo",
      key: "mucDo",
      render: (_, record) => {
        return (
          <>
            {_ === 1 && 'Quét mã QR'}
            {_ === 2 && 'Đăng nhập + Quét mã QR'}
            {_ === 3 && 'Không cho xem'}
          </>
        )
      }
    },
    {
      title: "Hành động",
      key: "hanhDong",
      render: (_, record) => (
        <div>
          <div>
            {nguoiDung?.isQr  && <Button
              onClick={() => {
                setChiTiet(record);
                setModalCauHinhQr(true)
                formCauHinhQR.setFieldValue('state', record?.mucDo || 1)
              }}
              type="link">
              Sửa
            </Button>}
            <Button type="link" onClick={() => {
              setChiTiet(record)   
              setModalChiTiet(true)}}>Chi tiết</Button>
           
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => { 
    if(nguoiDung?.isQr === false) {
      navigate(-1)
    }
  }, [nguoiDung]);

  return (
    <div>
      <Modal
        width={550}
        title={"Cấu hình QR"}
        open={modalCauHinhQr}
        onOk={() => {}}
        onCancel={() => {
          setModalCauHinhQr(false)
        }}
        footer={null}>
        <Form
          form={formCauHinhQR}
          name="formCauHinhQR"
          onFinish={handleEdit}
          autoComplete="off"
          initialValues={{
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
                loading={editLoading}
                type="primary"
                htmlType="submit">
                Đồng ý
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal 
        title='Chi tiết mã QR'
        width={700}
        open={modalChiTiet}
        onCancel={() => setModalChiTiet(false)}
        footer={null}
      >
        <div>
          {/* <div><span style={{width: 200}}>Mã số:</span><span style={{fontWeight: 'bold', fontSize: 15}}>ẦKAFWKF</span></div> */}
          {/* <div><span style={{width: 200}}>Nội dung:</span><span style={{fontWeight: 'bold', fontSize: 15}}>https://www.chukysoflames.com/FILE-DA-KY/VM0JF3</span></div> */}
          <div className="d-flex">
            <div style={{width: 90}}>Mã số:</div>
            <div style={{fontWeight: 'bold', fontSize: 15}}>{chiTiet?.maSo}</div>
          </div>

          <div className="d-flex">
            <div style={{width: 90}}>Nội dung:</div>
            <div style={{fontWeight: 'bold', fontSize: 15}}>{chiTiet?.noiDung}</div>
          </div>

          <div className="d-flex">
            <div style={{width: 90}}>Mức độ:</div>
            <div style={{fontWeight: 'bold', fontSize: 15}}>
            {chiTiet?.mucDo === 1 && 'Quét mã QR'}
            {chiTiet?.mucDo === 2 && 'Đăng nhập + Quét mã QR'}
            {chiTiet?.mucDo === 3 && 'Không cho xem'}
            </div>
          </div>

          <div className="download-ne d-flex justify-content-center mt-3 gap-4">
            <QRCode height={120} width={120} value={chiTiet?.noiDung} />

            <div>
              <div className="text-primary mb-2">tạo bởi {chiTiet?.nguoiDung?.hoTen} lúc {chiTiet?.ngayTao ? moment(chiTiet?.ngayTao).format('DD/MM/YYYY HH:mm:ss') : ''}</div>
              <Button type='primary' onClick={handleDownloadQR}>Tải mã QR</Button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="px-3 mt-3">
        <div className="mt-2 mb-4 d-flex justify-content-between">
          <Input
            style={{ width: 200 }}
            placeholder="Nhập mã số cần tìm"
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Table
          loading={getListLoading}
          columns={columns}
          dataSource={list}
          pagination={{ defaultPageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default MaQR;

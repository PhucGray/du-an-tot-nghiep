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
      title: "M?? s???",
      dataIndex: "maSo",
      key: "maSo",
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (_, record) => {
        return (
          <>
            {_ === true && '???? k??'}
            {_ === false && 'Ch??a k??'}
          </>
        )
      }
    },
    {
      title: "????? xu???t",
      dataIndex: "deXuat",
      key: "deXuat",
    },
    {
      title: "B???o m???t",
      dataIndex: "mucDo",
      key: "mucDo",
      render: (_, record) => {
        return (
          <>
            {_ === 1 && 'Qu??t m?? QR'}
            {_ === 2 && '????ng nh???p + Qu??t m?? QR'}
            {_ === 3 && 'Kh??ng cho xem'}
          </>
        )
      }
    },
    {
      title: "H??nh ?????ng",
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
              S???a
            </Button>}
            <Button type="link" onClick={() => {
              setChiTiet(record)   
              setModalChiTiet(true)}}>Chi ti???t</Button>
           
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
        title={"C???u h??nh QR"}
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
               <Radio value={1}>Xem file v???i m?? QR</Radio>
               <Radio value={2}>????ng nh???p + M?? QR</Radio>
               <Radio value={3}>Kh??ng cho xem</Radio>
             </Radio.Group>
           </Form.Item>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <Form.Item>
              <Button
                type="ghost"
                htmlType="button"
                onClick={() => setModalCauHinhQr(false)}>
                B??? qua
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                loading={editLoading}
                type="primary"
                htmlType="submit">
                ?????ng ??
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal 
        title='Chi ti???t m?? QR'
        width={700}
        open={modalChiTiet}
        onCancel={() => setModalChiTiet(false)}
        footer={null}
      >
        <div>
          {/* <div><span style={{width: 200}}>M?? s???:</span><span style={{fontWeight: 'bold', fontSize: 15}}>???KAFWKF</span></div> */}
          {/* <div><span style={{width: 200}}>N???i dung:</span><span style={{fontWeight: 'bold', fontSize: 15}}>https://www.chukysoflames.com/FILE-DA-KY/VM0JF3</span></div> */}
          <div className="d-flex">
            <div style={{width: 90}}>M?? s???:</div>
            <div style={{fontWeight: 'bold', fontSize: 15}}>{chiTiet?.maSo}</div>
          </div>

          <div className="d-flex">
            <div style={{width: 90}}>N???i dung:</div>
            <div style={{fontWeight: 'bold', fontSize: 15}}>{chiTiet?.noiDung}</div>
          </div>

          <div className="d-flex">
            <div style={{width: 90}}>M???c ?????:</div>
            <div style={{fontWeight: 'bold', fontSize: 15}}>
            {chiTiet?.mucDo === 1 && 'Qu??t m?? QR'}
            {chiTiet?.mucDo === 2 && '????ng nh???p + Qu??t m?? QR'}
            {chiTiet?.mucDo === 3 && 'Kh??ng cho xem'}
            </div>
          </div>

          <div className="download-ne d-flex justify-content-center mt-3 gap-4">
            <QRCode height={120} width={120} value={chiTiet?.noiDung} />

            <div>
              <div className="text-primary mb-2">t???o b???i {chiTiet?.nguoiDung?.hoTen} l??c {chiTiet?.ngayTao ? moment(chiTiet?.ngayTao).format('DD/MM/YYYY HH:mm:ss') : ''}</div>
              <Button type='primary' onClick={handleDownloadQR}>T???i m?? QR</Button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="px-3 mt-3">
        <div className="mt-2 mb-4 d-flex justify-content-between">
          <Input
            style={{ width: 200 }}
            placeholder="Nh???p m?? s??? c???n t??m"
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

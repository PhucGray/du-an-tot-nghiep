import "../../../styles/common.scss";
import "../../../styles/tabs.scss";

import React, { useState, useRef, useEffect } from "react";
import ModalUpdateImage from "../../../components/Modal/ModalUpdateImage";
import { handleUploadImage } from "../../../utils/images";
import { Button, Checkbox, Form, Input, message, Radio, Select } from "antd";
import { useSelector } from "react-redux";
import {
  nguoiDungSelector,
  tokenSelector,
} from "../../../store/auth/selectors";
import { getDsChucDanhSvc } from "../../../store/chucdanh/service";
import {
  LOI,
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../constants/api";
import {
  getNguoiDungById,
  suaNguoiDungSvc,
} from "../../../store/nguoidung/service";
import { useDispatch } from "react-redux";
import { setNguoiDung } from "../../../store/auth/actions";
import { getQuyenSvc } from "../../../store/nguoidung_vaitro/service";

const { Option } = Select;
const { TextArea } = Input;

const CaNhan = () => {
  const dispatch = useDispatch();
  const editorRef = useRef();
  const inputFileRef = useRef();

  const nguoiDung = useSelector(nguoiDungSelector);
  const token = useSelector(tokenSelector);
  const [form] = Form.useForm();

  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);

  const [getListChucDanhLoading, setGetListChucDanhLoading] = useState(false);
  const [listChucDanh, setListChucDanh] = useState([]);
  const [editLoading, setEditLoading] = useState(false);

  const g = async (nguoiDung) => {
    try {
      const res = await getQuyenSvc({id: nguoiDung?.ma_NguoiDung});
      const listMaQuyen = res.data?.map(item => item?.ma_Quyen)

      const a = id => listMaQuyen.includes(id);

      const isHeThong = a(1);
      const isKySo = a(2);
      const isDeXuat = a(3);
      const isDuyet = a(4);
      const isXemKySo = a(5);
      const isVanBan = a(6);
      const isQr = a(8);

      
      dispatch(setNguoiDung({
        token,
        nguoiDung: {
          ...nguoiDung,
          isHeThong,
          isKySo,
          isDeXuat,
          isDuyet,
          isXemKySo,
          isVanBan,
          isQr
        }
      }))
    } catch (error) {
      
    }
    // console.log(res.data)

  }

  const handleEdit = async (values) => {
    const data = !!url
      ? {
          ma_NguoiDung: nguoiDung?.ma_NguoiDung,
          hoTen: values.hoTen,
          sdt: values.sdt,
          diaChi: values.diaChi,
          gioiTinh: values.gioiTinh,
          avatar: url,
          ma_ChucDanh: nguoiDung.ma_ChucDanh,
        }
      : {
          ma_NguoiDung: nguoiDung?.ma_NguoiDung,
          hoTen: values.hoTen,
          sdt: values.sdt,
          diaChi: values.diaChi,
          gioiTinh: values.gioiTinh,
          ma_ChucDanh: nguoiDung.ma_ChucDanh,
        };

    setEditLoading(true);

    try {
      const res = await suaNguoiDungSvc(data);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        
        message.success(res.data?.retText);

        const res_2 = await getNguoiDungById({ id: nguoiDung?.ma_NguoiDung });

        if (
          res_2.status === SUCCESS &&
          res_2.data?.retCode === RETCODE_SUCCESS
        ) {
          dispatch(setNguoiDung({ token, nguoiDung: res_2.data?.data }));
          g(res_2.data?.data)
          // console.log();
        } else {
          message.error(res.data?.retText);
        }
      } else {
        message.error(res.data?.retText);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setEditLoading(false);
    }
  };

  const handleGetListChucDanh = async () => {
    setGetListChucDanhLoading(true);
    try {
      const res = await getDsChucDanhSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setListChucDanh(
          res.data?.data?.map((i) => {
            return {
              maSo: i?.ma_ChucDanh,
              tenChucDanh: i?.ten_ChucDanh,
              thuTu: i?.order,
              key: i?.ma_ChucDanh,
            };
          }),
        );
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setGetListChucDanhLoading(false);
    }
  };

  // console.log(nguoiDung);
  useEffect(() => {
    if (nguoiDung) {
      console.log(nguoiDung?.hoTen);
      // form.setFieldValue("itemName", nguoiDung?.itemName);
      form.setFieldValue("email", nguoiDung?.email);
      form.setFieldValue("hoTen", nguoiDung?.hoTen);
      form.setFieldValue("sdt", nguoiDung?.sdt);
      form.setFieldValue("gioiTinh", nguoiDung?.gioiTinh);
      form.setFieldValue("diaChi", nguoiDung?.diaChi);
      form.setFieldValue("ma_ChucDanh", nguoiDung?.ma_ChucDanh);

      setUrl(!!nguoiDung?.avatar ? nguoiDung?.avatar : "");
    }

    // return () => {
    //   resetFormTab();
    //   form.resetFields();
    // };
  }, [nguoiDung]);

  useEffect(() => {
    handleGetListChucDanh();
  }, []);

  return (
    <div className="ca-nhan">
      {modalVisible && (
        <ModalUpdateImage
          title="Thay ?????i ???nh ?????i di???n"
          setUrl={setUrl}
          image={image}
          onClose={() => {
            setModalVisible(false);
          }}
        />
      )}

      <input
        className="input-file"
        ref={inputFileRef}
        type="file"
        multiple={false}
        onChange={(e) =>
          handleUploadImage(e, (images) => {
            setImage(images[0]);
            setModalVisible(true);
            e.target.value = null;
          })
        }
      />

      <div className="avatar-wrapper mt-3">
        <img
          onClick={() => inputFileRef.current?.click()}
          src={
            url ||
            "https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360"
          }
          className="avatar"
        />
      </div>

      <Form
        form={form}
        className="form mx-auto mt-3 pb-5"
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={handleEdit}
        autoComplete="off"
        layout="vertical">
        <Form.Item
          label="H??? v?? t??n"
          name="hoTen"
          rules={[
            {
              required: true,
              message: "Vui l??ng nh???p h??? v?? t??n!",
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Vui l??ng nh???p email!",
            },
            {
              type: "email",
              message: "Email sai ?????nh d???ng!",
            },
          ]}>
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Gi???i t??nh"
          name="gioiTinh"
          initialValue={true}
          rules={[
            {
              required: true,
              message: "Vui l??ng ch???n gi???i t??nh!",
            },
          ]}>
          <Radio.Group>
            <Radio value={true}>Nam</Radio>
            <Radio value={false}>N???</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="S??? ??i???n tho???i"
          name="sdt"
          rules={[
            {
              required: true,
              message: "Vui l??ng nh???p s??? ??i???n tho???i!",
            },
            {
              pattern: new RegExp(
                /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/g,
              ),
              message: "S??? ??i???n tho???i sai ?????nh d???ng!",
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          style={{ width: "100%" }}
          label="?????a ch???"
          name="diaChi"
          rules={[
            {
              required: true,
              message: "Vui l??ng nh???p ?????a ch???!",
            },
          ]}>
          <TextArea placeholder="Nh???p ?????a ch???" style={{ height: 100 }} />
        </Form.Item>

        <Form.Item
          style={{ width: "100%", pointerEvents: "none", cursor: "default" }}
          label="Ch???c danh"
          name="ma_ChucDanh">
          <Select
            showArrow={false}
            placeholder="Ch???n ch???c danh"
            style={{
              width: "100%",
            }}>
            {listChucDanh.map((item, index) => (
              <Option key={index} value={item?.maSo}>
                {item?.tenChucDanh}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Button
          loading={editLoading}
          type="primary"
          htmlType="submit"
          className="w-100">
          C???p nh???t
        </Button>
      </Form>
    </div>
  );
};

export default CaNhan;

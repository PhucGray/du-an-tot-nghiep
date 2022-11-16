import { Button, Form, Input, message, Radio, Select } from "antd";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { PlusSquareTwoTone } from "@ant-design/icons";
import {
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../../constants/api";
import {
  suaNguoiDungSvc,
  themNguoiDungSvc,
} from "../../../../store/nguoidung/service";
import { getDsChucDanhSvc } from "../../../../store/chucdanh/service";
import { phoneRegex } from "../../../../utils/regex";
import { handleUploadImage } from "../../../../utils/images";
import ModalUpdateImage from "../../../../components/Modal/ModalUpdateImage";
import formState from "../assets/formState";

const { TextArea } = Input;
const { Option } = Select;

export default ({ userData, userFormState, resetFormTab }) => {
  const [form] = Form.useForm();

  const isEdit = userFormState === formState.EDIT;
  const isDetail = userFormState === formState.DETAIL;

  const inputFileRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const [listChucDanh, setListChucDanh] = useState([]);
  const [getListChucDanhLoading, setGetListChucDanhLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const handleAdd = async (values) => {
    const data = !!url
      ? {
          email: values.email,
          hoTen: values.itemName,
          sdt: values.sdt,
          diaChi: values.diaChi,
          gioiTinh: values.gioiTinh,
          ma_ChucDanh: values.ma_ChucDanh,
          passWord: values.passWord,
          retypePassWord: values.retypePassWord,
          avatar: url,
        }
      : {
          email: values.email,
          hoTen: values.itemName,
          sdt: values.sdt,
          diaChi: values.diaChi,
          gioiTinh: values.gioiTinh,
          ma_ChucDanh: values.ma_ChucDanh,
          passWord: values.passWord,
          retypePassWord: values.retypePassWord,
        };
    setAddLoading(true);

    try {
      const res = await themNguoiDungSvc(data);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
      } else {
        //message.error(res.data?.retText);
      }
      form.resetFields();
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setAddLoading(false);
    }
  };

  const handleEdit = async (values) => {
    const data = !!url
      ? {
          ma_NguoiDung: userData?.maSo,
          hoTen: values.itemName,
          sdt: values.sdt,
          diaChi: values.diaChi,
          gioiTinh: values.gioiTinh,
          avatar: url,
          ma_ChucDanh: values.ma_ChucDanh,
        }
      : {
          ma_NguoiDung: userData?.maSo,
          hoTen: values.itemName,
          sdt: values.sdt,
          diaChi: values.diaChi,
          gioiTinh: values.gioiTinh,
          ma_ChucDanh: values.ma_ChucDanh,
        };

    setAddLoading(true);

    try {
      const res = await suaNguoiDungSvc(data);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
      } else {
        //message.error(res.data?.retText);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setAddLoading(false);
    }
  };

  const handleGetListChucDanh = async () => {
    setGetListChucDanhLoading(true);
    try {
      const res = await getDsChucDanhSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setListChucDanh(
          res.data?.data
            ?.filter(
              (i) =>
                i?.isDeleted === false &&
                (i?.isSelected === false ||
                  ((isEdit || isDetail) &&
                    i?.ma_ChucDanh === userData?.ma_ChucDanh)),
            )
            ?.map((i) => {
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

  useEffect(() => {
    handleGetListChucDanh();
  }, []);

  useEffect(() => {
    if ((isEdit || isDetail) && userData) {
      form.setFieldValue("itemName", userData?.itemName);
      form.setFieldValue("email", userData?.email);
      form.setFieldValue("sdt", userData?.sdt);
      form.setFieldValue("gioiTinh", userData?.gioiTinh);
      form.setFieldValue("diaChi", userData?.diaChi);
      form.setFieldValue("ma_ChucDanh", userData?.ma_ChucDanh);

      setUrl(!!userData?.avatar ? userData?.avatar : "");
    }

    return () => {
      resetFormTab();
      form.resetFields();
    };
  }, [userFormState]);

  return (
    <div>
      <Form
        disabled={isDetail}
        form={form}
        className="mx-auto mt-3"
        name="basic"
        onFinish={isEdit ? handleEdit : handleAdd}
        autoComplete="off"
        layout="vertical">
        <div className="d-flex justify-content-center w-75 mx-auto gap-3">
          <Form.Item
            style={{ width: "40%" }}
            label="Tên người dùng"
            name="itemName"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên người dùng!",
              },
            ]}>
            <Input placeholder="Nhập tên người dùng" />
          </Form.Item>

          <Form.Item
            style={{ width: "40%" }}
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
              {
                type: "email",
                message: "Email sai định dạng",
              },
            ]}>
            <Input disabled={isEdit} placeholder="Nhập email" />
          </Form.Item>
        </div>

        <div className="d-flex justify-content-center w-75 mx-auto gap-3">
          <Form.Item
            style={{ width: "40%" }}
            label="Số điện thoại"
            name="sdt"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại!",
              },
              {
                pattern: phoneRegex,
                message: "Số điện thoại sai định dạng",
              },
            ]}>
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            style={{ width: "40%" }}
            name="gioiTinh"
            label="Giới tính"
            initialValue={true}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn giới tính!",
              },
            ]}>
            <Radio.Group>
              <Radio value={true}>Nam</Radio>
              <Radio value={false}>Nữ</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        {!(isEdit || isDetail) && (
          <div className="d-flex justify-content-center w-75 mx-auto gap-3">
            <Form.Item
              style={{ width: "40%" }}
              label="Mật khẩu"
              name="passWord"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
                {
                  min: 6,
                  message: "Nhập mật khẩu ít nhất 6 ký tự",
                },
              ]}>
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item
              style={{ width: "40%" }}
              label="Nhập lại mật khẩu"
              name="retypePassWord"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lại mật khẩu!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("passWord") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu không trùng khớp!"),
                    );
                  },
                }),
              ]}>
              <Input.Password placeholder="Xác nhận mật khẩu" />
            </Form.Item>
          </div>
        )}

        <div className="d-flex justify-content-center w-75 mx-auto gap-3">
          <Form.Item
            style={{ width: "40%" }}
            label="Địa chỉ"
            name="diaChi"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập địa chỉ!",
              },
            ]}>
            <TextArea placeholder="Nhập địa chỉ" style={{ height: 100 }} />
          </Form.Item>

          {
            <Form.Item
              style={{ width: "40%" }}
              label="Chức danh"
              name="ma_ChucDanh"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn chức danh!",
                },
              ]}>
              <Select
                placeholder="Chọn chức danh"
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
          }
        </div>

        <div className="d-flex justify-content-center w-75 mx-auto gap-3">
          <div style={{ width: "40%" }}>
            <div className="ant-col ant-form-item-label">Ảnh đại diện</div>
            <div
              onClick={() => {
                if (isDetail) return;
                inputFileRef.current?.click();
              }}
              style={{
                width: 100,
                height: 100,
                border: `${url ? 0 : 1}px dashed #7a7a7a`,
                display: "grid",
                placeItems: "center",
                cursor: isDetail ? "not-allowed" : "pointer",
                position: "relative",
                backgroundColor: isDetail ? "#d9d9d9" : undefined,
                borderRadius: 10
              }}>
              {!url && <PlusSquareTwoTone />}

              {!!url && (
                <img
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    left: 0,
                    top: 0,
                  }}
                  src={url}
                />
              )}
            </div>
          </div>

          <div style={{ width: "40%" }}></div>
        </div>

        {!isDetail && (
          <div className="d-flex justify-content-center mt-3 mb-5">
            <Button
              loading={addLoading}
              type="primary"
              htmlType="submit"
              className="submit-btn w-25">
              {isEdit ? "Sửa" : "Thêm"}
            </Button>
          </div>
        )}
      </Form>

      <input
        style={{ position: "absolute", left: "-100vw" }}
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

      {modalVisible && (
        <ModalUpdateImage
          title="Thêm ảnh đại diện"
          setUrl={setUrl}
          image={image}
          onClose={() => {
            setModalVisible(false);
          }}
        />
      )}
    </div>
  );
};

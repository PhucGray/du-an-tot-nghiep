import "../../../styles/common.scss";

import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { nguoiDungSelector } from "../../../store/auth/selectors";
import { useState } from "react";
import {
  LOI,
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../constants/api";
import { doiMatKhau } from "../../../store/auth/services";
// import { useForm } from "antd/es/form/Form";

const MatKhau = () => {
  const [form] = Form.useForm();
  const nguoiDung = useSelector(nguoiDungSelector);

  const [editLoading, setEditLoading] = useState(false);

  const handleEdit = async (values) => {
    setEditLoading(true);
    try {
      const res = await doiMatKhau({
        ...values,
        email: nguoiDung?.email,
      });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        form.resetFields();
      } else {
        message.error(res.data?.retText);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="d-flex h-100 flex-column align-items-center mt-5">
      <Form
        form={form}
        className="form"
        name="basic"
        size='large'
        initialValues={{
          remember: true,
        }}
        onFinish={handleEdit}
        autoComplete="off"
        layout="vertical">
        <Form.Item
          label="Mật khẩu hiện tại"
          name="passWord"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu hiện tại!",
            },
            {
              min: 6,
              message: "Vui lòng nhập mật khẩu từ 6 - 12 ký tự",
            },
            {
              max: 12,
              message: "Vui lòng nhập mật khẩu từ 6 - 12 ký tự",
            },
          ]}>
          <Input.Password placeholder="Nhập mật khẩu hiện tại" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPass"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu mới!",
            },
            {
              min: 6,
              message: "Vui lòng nhập mật khẩu từ 6 - 12 ký tự",
            },
            {
              max: 12,
              message: "Vui lòng nhập mật khẩu từ 6 - 12 ký tự",
            },
          ]}>
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="retypePass"
          dependencies={["newPass"]}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập xác nhận mật khẩu!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPass") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Xác nhận mật khẩu không trùng khớp!"),
                );
              },
            }),
          ]}>
          <Input.Password placeholder="Nhập xác nhận mật khẩu" />
        </Form.Item>

        <Button
          loading={editLoading}
          type="primary"
          htmlType="submit"
          className="submit-btn">
          Cập nhật
        </Button>
      </Form>
    </div>
  );
};

export default MatKhau;

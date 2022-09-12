import "../../styles/auth.css";

import React from "react";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="c-container">
      <Form
        className="c-form"
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical">
        <div className="c-form-title">Đặt lại mật khẩu</div>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu mới!",
            },
          ]}>
          <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmNewPassword"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập xác nhận mật khẩu!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không trùng khớp!"));
              },
            }),
          ]}>
          <Input.Password size="large" placeholder="Nhập xác nhận mật khẩu" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          className="submit-btn"
          size="large"
          style={{ height: 45 }}>
          Cập nhật
        </Button>

        <Link to="/">
          <div className="bottom-text">Quay lại đăng nhập</div>
        </Link>
      </Form>
    </div>
  );
};

export default ResetPassword;

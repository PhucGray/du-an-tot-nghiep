import "../../styles/auth.css";

import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";

const SignIn = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="container">
      <div className="form-title">Đăng nhập</div>

      <Form
        className="form"
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical">
        <Form.Item
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
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu!",
            },
          ]}>
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item name="remember">
          <Checkbox>Ghi nhớ đăng nhập</Checkbox>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          className="submit-btn"
          size="large">
          Đăng nhập
        </Button>
      </Form>
    </div>
  );
};

export default SignIn;

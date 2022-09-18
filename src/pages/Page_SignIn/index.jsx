import "../../styles/auth.css";

import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
    // alert("run");K
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
        <div className="c-form-title">Đăng nhập</div>

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
          <Input size="large" placeholder="Nhập email" />
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
          <Input.Password size="large" placeholder="Nhập mật khẩu" />
        </Form.Item>

        <div className="d-flex justify-content-between">
          <Form.Item name="remember">
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>

          <Link to="forgot-password">Quên mật khẩu ?</Link>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          className="submit-btn"
          size="large"
          style={{ height: 45 }}>
          Đăng nhập
        </Button>
      </Form>
    </div>
  );
};

export default SignIn;

import "../../styles/auth.css";

import React, { useRef } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { useState } from "react";
import { useForm } from "antd/lib/form/Form";

const SECRET_KEY = "6LfAy-ohAAAAALIh0SUR83BO4KLe4ikUWv76zLcE";

const ResetPassword = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="container">
      <div className="form-title">Đặt lại mật khẩu</div>

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
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu mới!",
            },
          ]}>
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmNewPassword"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập xác nhận mật khẩu!",
            },
          ]}>
          <Input.Password placeholder="Nhập xác nhận mật khẩu" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          className="submit-btn"
          size="large">
          Cập nhật
        </Button>
      </Form>
    </div>
  );
};

export default ResetPassword;

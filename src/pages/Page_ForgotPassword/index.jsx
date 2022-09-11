import "../../styles/auth.css";

import React, { useRef } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { useState } from "react";

const SECRET_KEY = "6LfAy-ohAAAAALIh0SUR83BO4KLe4ikUWv76zLcE";

const ForgotPassword = () => {
  const captchaRef = useRef();

  const [submitDisabled, setSubmitDisabled] = useState(true);

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onCaptchaChange = (token) => {
    if (token) {
      setSubmitDisabled(false);
    }
  };

  return (
    <div className="container">
      <div className="form-title">Lấy lại mật khẩu</div>

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
          label="Tên đăng nhập"
          name="username"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên đăng nhập!",
            },
          ]}>
          <Input.Password placeholder="Nhập tên đăng nhập" />
        </Form.Item>

        <ReCAPTCHA
          sitekey={SECRET_KEY}
          onChange={onCaptchaChange}
          // grecaptcha={grecaptchaObject}
          ref={captchaRef}
        />

        <Button
          disabled={submitDisabled}
          type="primary"
          htmlType="submit"
          className="submit-btn"
          size="large">
          Gửi email
        </Button>
      </Form>
    </div>
  );
};

export default ForgotPassword;

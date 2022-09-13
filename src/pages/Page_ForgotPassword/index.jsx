import "../../styles/auth.css";

import React, { useRef } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { useState } from "react";
import Reaptcha from "reaptcha";

const SECRET_KEY = "6LfAy-ohAAAAALIh0SUR83BO4KLe4ikUWv76zLcE";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const captchaRef = useRef();

  const [submitDisabled, setSubmitDisabled] = useState(true);

  const onFinish = (values) => {
    console.log("Success:", values);
    navigate("/confirm-otp");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onVerify = () => {
    captchaRef.current
      .getResponse()
      .then((res) => {
        // success
        setSubmitDisabled(false);
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
      });
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
        <div className="c-form-title">Lấy lại mật khẩu</div>
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
          label="Tên đăng nhập"
          name="username"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên đăng nhập!",
            },
          ]}>
          <Input size="large" placeholder="Nhập tên đăng nhập" />
        </Form.Item>

        <Reaptcha sitekey={SECRET_KEY} ref={captchaRef} onVerify={onVerify} />

        <Button
          disabled={submitDisabled}
          type="primary"
          htmlType="submit"
          className="submit-btn"
          size="large"
          style={{ height: 45 }}>
          Gửi email
        </Button>

        <Link to="/">
          <div className="bottom-text">Quay lại đăng nhập</div>
        </Link>
      </Form>
    </div>
  );
};

export default ForgotPassword;

import "../../styles/auth.scss";
import "../../styles/common.scss";

import React, { useRef } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="auth-container">
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
        <div className="form-title">Lấy lại mật khẩu</div>
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

        <Reaptcha sitekey={SECRET_KEY} ref={captchaRef} onVerify={onVerify} />

        <Button
          disabled={submitDisabled}
          type="primary"
          htmlType="submit"
          className="submit-btn"
          size="large">
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

import "../../styles/auth.scss";
import "../../styles/common.scss";

import React from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { dangNhap } from "../../store/auth/services";
import { SUCCESS, RETCODE_SUCCESS, LOI_HE_THONG } from "../../constants/api";
import { useDispatch } from "react-redux";
import { setNguoiDung } from "../../store/auth/actions";
import api from "../../api";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);

  const onFinish = async (values) => {
    setSubmitLoading(true);
    try {
      const res = await dangNhap(values);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        // console.log(res.data?.data);

        const token = res.data?.data?.token;
        api.defaults.headers.common = {
          Authorization: `Bearer ${token}`,
        };
        dispatch(setNguoiDung(res.data?.data));
        navigate('/', {replace: true})
      } else {
        message.error(res.data?.retText);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setSubmitLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
        <div className="form-title">Đăng nhập</div>

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
          name="passWord"
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
          loading={submitLoading}
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

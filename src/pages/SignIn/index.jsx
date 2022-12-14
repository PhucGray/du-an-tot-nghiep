import "../../styles/auth.scss";
import "../../styles/common.scss";

import React, {useEffect} from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { dangNhap } from "../../store/auth/services";
import { SUCCESS, RETCODE_SUCCESS, LOI_HE_THONG } from "../../constants/api";
import { useDispatch } from "react-redux";
import { setNguoiDung } from "../../store/auth/actions";
import api from "../../api";
import LoginImg from "../../assets/images/login.png";
import {getQuyenSvc} from '../../store/nguoidung_vaitro/service'
const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);

  const rememberUser = JSON.parse(localStorage.getItem('rememberUser'))

  const onFinish = async (values) => {
    setSubmitLoading(true);
    try {
      const res = await dangNhap(values);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        if(values.remember) {
          localStorage.setItem('rememberUser', JSON.stringify(values))
        } else {
          localStorage.removeItem('rememberUser');
        }

        const token = res.data?.data?.token;
        api.defaults.headers.common = {
          Authorization: `Bearer ${token}`,
        };
        dispatch(setNguoiDung(res.data?.data));
        message.success(res.data?.retText);

        // setTimeout(() => {
        //   navigate("/", { replace: true });
        // }, 3000);

        // window.location.reload();
      } else {
        message.error(res.data?.retText);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setSubmitLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

//   useEffect(() => {
//     fetch('https://apidevv2.stnhd.com/api/vi-VN/User/Login', {
//   method: 'POST',
//   body: JSON.stringify({
//     "userName": "p700@gmail.com",
//     "password": "000000",
//     "appName": "5PTB"
//   }),
//   headers: {
//     'Content-type': 'application/json; charset=UTF-8',
//   },
// })
//   .then((response) => response.json())
//   .then((json) => console.log(json));
//   }, []);

  return (
    <div className="d-flex">
      <div
        style={{
          background: "#0099ff",
          height: "100vh",
          width: "50vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          background: "linear-gradient(to bottom, #3366ff 0%, #0099ff 100%)",
        }}>
        <img src={LoginImg} style={{ width: "80%" }} />
      </div>
      <div
        style={{
          height: "100vh",
          width: "50vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Form
          className="form"
          name="basic"
          initialValues={rememberUser ? {...rememberUser} : {}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical">
          <div className="form-title">????ng nh???p</div>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Vui l??ng nh???p email!",
              },
              {
                type: "email",
                message: "Email sai ?????nh d???ng",
              },
            ]}>
            <Input
              style={{ borderRadius: 10 }}
              size="large"
              placeholder="Nh???p email"
            />
          </Form.Item>

          <Form.Item
            label="M???t kh???u"
            name="passWord"
            rules={[
              {
                required: true,
                message: "Vui l??ng nh???p m???t kh???u!",
              },
            ]}>
            <Input.Password
              style={{ borderRadius: 10 }}
              size="large"
              placeholder="Nh???p m???t kh???u"
            />
          </Form.Item>

          <div className="d-flex justify-content-between">
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox onChange={e => {
              
              }}>Ghi nh??? ????ng nh???p</Checkbox>
            </Form.Item>

            {/* <Link to="forgot-password">Qu??n m???t kh???u ?</Link> */}
          </div>

          <Button
            loading={submitLoading}
            type="primary"
            htmlType="submit"
            className="submit-btn"
            size="large">
            ????ng nh???p
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;

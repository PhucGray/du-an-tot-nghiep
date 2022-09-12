import "../../styles/auth.css";

import React from "react";
import { Button } from "antd";

import OtpInput from "react-otp-input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const OTP_ERROR_INCORRECT = "OTP không chính xác";
const OTP_ERROR_REQUIRED = "Vui lòng nhập OTP";

const ConfirmOTP = () => {
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleConfirmClick = () => {
    if (!otpValue) return setOtpError(OTP_ERROR_REQUIRED);

    navigate("/reset-password");
  };

  return (
    <div className="c-container">
      <div className="c-form">
        <div className="c-form-title">Xác nhận OTP</div>
        <OtpInput
          value={otpValue}
          onChange={(otp) => {
            setOtpError("");
            setOtpValue(otp);
          }}
          numInputs={6}
          shouldAutoFocus={false}
          hasErrored={!!otpError}
          errorStyle={{ borderColor: "red" }}
          inputStyle={{
            height: 60,
            width: 53,
            borderRadius: 0,
            border: "1px solid gray",
          }}
          focusStyle={{
            borderRadius: 0,
            borderWidth: 1,
          }}
          isInputNum={true}
          containerStyle={{
            width: 400,
            justifyContent: "space-evenly",
            marginInline: "auto",
            marginBottom: 10,
          }}
        />

        {!!otpError && <div className="otp-error">{otpError}</div>}

        <Button
          onClick={handleConfirmClick}
          type="primary"
          htmlType="button"
          className="submit-btn"
          size="large"
          style={{ height: 45 }}>
          Xác nhận
        </Button>

        <div className="d-flex justify-content-center mt-4">
          Chưa nhận được OTP? <Button type="link">Gửi lại</Button>
        </div>

        <Link to="/">
          <div className="bottom-text">Quay lại đăng nhập</div>
        </Link>
      </div>
    </div>
  );
};

export default ConfirmOTP;

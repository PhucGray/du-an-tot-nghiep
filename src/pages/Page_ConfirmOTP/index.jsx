import "../../styles/auth.css";

import React from "react";
import { Button } from "antd";

import OtpInput from "react-otp-input";
import { useState } from "react";

const OTP_ERROR_INCORRECT = "OTP không chính xác";
const OTP_ERROR_REQUIRED = "Vui lòng nhập OTP";

const ConfirmOTP = () => {
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleConfirmClick = () => {
    if (!otpValue) {
      setOtpError(OTP_ERROR_REQUIRED);
    }
  };

  return (
    <div className="container">
      <div className="form-title">Xác nhận OTP</div>

      <div className="form">
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
            height: 45,
            width: 40,
            borderRadius: 0,
            border: "1px solid gray",
          }}
          focusStyle={{
            borderRadius: 0,
            borderWidth: 1,
          }}
          isInputNum={true}
          containerStyle={{
            width: 300,
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
          size="large">
          Xác nhận
        </Button>
      </div>
    </div>
  );
};

export default ConfirmOTP;

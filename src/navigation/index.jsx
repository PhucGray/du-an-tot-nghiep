import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Page_SignIn from "../pages/Page_SignIn";
import Page_ForgotPassword from "../pages/Page_ForgotPassword";
import Page_ResetPassword from "../pages/Page_ResetPassword";
import Page_ConfirmOTP from "../pages/Page_ConfirmOTP";
import Page_TrySign from "../pages/Page_TrySign";
import Page_Profile from "../pages/Page_Profile";
import Page_SignSteps from "../pages/Page_SignSteps";
import Page_ManageUser from "../pages/Page_ManageUser";

const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Page_ForgotPassword />} />

      {/* <Route path="/" element={<Page_SignIn />} /> */}
      {/* <Route path="/forgot-password" element={<Page_ForgotPassword />} /> */}
      {/* <Route path="/confirm-otp" element={<Page_ConfirmOTP />} /> */}
      {/* <Route path="/reset-password" element={<Page_ResetPassword />} /> */}
      {/* <Route path="/" element={<Page_Profile />} /> */}
      {/* <Route path="/" element={<Page_SignSteps />} /> */}
      {/* <Route path="/" element={<Page_ManageUser />} /> */}
    </Routes>
  );
};

export default Navigation;

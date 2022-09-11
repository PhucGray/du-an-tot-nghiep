import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Page_SignIn from "../pages/Page_SignIn";
import Page_ForgotPassword from "../pages/Page_ForgotPassword";
import Page_ResetPassword from "../pages/Page_ResetPassword";
import Page_ConfirmOTP from "../pages/Page_ConfirmOTP";
import Page_TrySign from "../pages/Page_TrySign";

const Navigation = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Page_SignIn />} /> */}
      {/* <Route path="/" element={<Page_ForgotPassword />} /> */}
      {/* <Route path="/" element={<Page_ResetPassword />} /> */}
      {/* <Route path="/" element={<Page_ConfirmOTP />} /> */}
      <Route path="/" element={<Page_TrySign />} />
    </Routes>
  );
};

export default Navigation;

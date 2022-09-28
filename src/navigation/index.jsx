import React, { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Page_SignIn from "../pages/Page_SignIn";
import Page_ForgotPassword from "../pages/Page_ForgotPassword";
import Page_ResetPassword from "../pages/Page_ResetPassword";
import Page_ConfirmOTP from "../pages/Page_ConfirmOTP";
import Page_TrySign from "../pages/Page_TrySign";
import Page_ManageUser from "../pages/Page_ManageUser";
import Page_TestPdf from "../pages/Page_TestPdf";
import Page_SignPdf from "../pages/Page_SignPdf";
import MainLayout from "../layout/MainLayout";

const Navigation = () => {
  return (
    <Fragment>
      <MainLayout />
    </Fragment>
  );
  //  <Routes>
  {
    /* <Route path="/" element={<Page_SignSteps />} /> */
  }

  {
    /* <Route path="/" element={<Page_SignIn />} /> */
  }
  {
    /* <Route path="/forgot-password" element={<Page_ForgotPassword />} /> */
  }
  {
    /* <Route path="/" element={<Page_ConfirmOTP />} /> */
  }
  {
    /* <Route path="/reset-password" element={<Page_ResetPassword />} /> */
  }

  {
    /* <Route path="/" element={<Page_ManageUser />} /> */
  }
  {
    /* <Route path="/" element={<Page_TrySign />} /> */
  }
  {
    /* <Route path="/" element={<Page_TestPdf />} /> */
  }
  // </Routes>

  // );
};

export default Navigation;

import "../../styles/common.scss";
import "./styles.scss";

import React, { useState, useRef, useEffect } from "react";
import ModalUpdateImage from "../../components/Modal/ModalUpdateImage";
import { handleUploadImage } from "../../utils/images";
import { Button, Checkbox, Form, Input, Radio } from "antd";

const Profile = () => {
  const editorRef = useRef();
  const inputFileRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {modalVisible && (
        <ModalUpdateImage
          setUrl={setUrl}
          image={image}
          onClose={() => {
            setModalVisible(false);
          }}
        />
      )}

      <input
        className="input-file"
        ref={inputFileRef}
        type="file"
        multiple={false}
        onChange={(e) =>
          handleUploadImage(e, (images) => {
            setImage(images[0]);
            setModalVisible(true);
            e.target.value = null;
          })
        }
      />

      <div className="avatar-wrapper">
        <img
          onClick={() => inputFileRef.current?.click()}
          src={
            url ||
            "https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360"
          }
          className="avatar"
        />
      </div>

      <Form
        className="form mx-auto mt-3 pb-5"
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical">
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên đăng nhập!",
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập họ và tên!",
            },
          ]}>
          <Input />
        </Form.Item>

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
              message: "Email sai định dạng!",
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item label="Radio">
          <Radio.Group>
            <Radio value="nam">Nam</Radio>
            <Radio value="nu">Nữ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại!",
            },
            {
              pattern: new RegExp(
                /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/g,
              ),
              message: "Số điện thoại sai định dạng!",
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại 2"
          name="phone2"
          rules={[
            {
              pattern: new RegExp(
                /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/g,
              ),
              message: "Số điện thoại sai định dạng!",
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại 3"
          name="phone3"
          rules={[
            {
              pattern: new RegExp(
                /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/g,
              ),
              message: "Số điện thoại sai định dạng!",
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Chức danh"
          name="title"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập vai trò!",
            },
          ]}>
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit" className="w-100">
          Cập nhật
        </Button>
      </Form>
    </>
  );
};

export default Profile;

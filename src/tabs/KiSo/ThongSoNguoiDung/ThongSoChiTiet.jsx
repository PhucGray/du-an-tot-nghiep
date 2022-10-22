import { Button, Form, Input, Modal, Radio, Upload } from "antd";
import React from "react";
import {
  EditOutlined,
  LockOutlined,
  SettingOutlined,
  HistoryOutlined,
  HighlightOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const Row = ({ label, children, even = true }) => {
  return (
    <div
      className="d-flex"
      style={{ backgroundColor: even ? "#d9d9d9" : "#fff", minHeight: 50 }}>
      <div
        className="d-flex align-items-center justify-content-end pe-2"
        style={{
          width: 200,
          textAlign: "right",
          marginRight: 10,
        }}>
        {label}
      </div>
      <div
        style={{
          minHeight: "100%",
          width: 1,
          backgroundColor: even ? "#fff" : "#d9d9d9",
        }}></div>
      <div
        className="d-flex align-items-center"
        style={{
          paddingLeft: 10,
        }}>
        {children}
      </div>
    </div>
  );
};

const PASSCODE = "passcode";
const CAU_HINH = "cauhinh";

const _Modal = ({ type = PASSCODE }) => {
  const handleChangePasscode = async (values) => {};

  let title = "";
  switch (type) {
    case PASSCODE:
      title = "Sửa thông số";
      break;
    case CAU_HINH:
      title = "Cấu hình chữ ký";
      break;
  }

  return (
    <Modal
      title={title}
      open={false}
      onOk={() => {}}
      onCancel={() => {
        // setIsModalOpen(false);
        // setIsEdit(false);/
        // setIsDetail(false);
        // form.resetFields();
      }}
      footer={null}>
      <Form
        // form={form}
        name="suapassword"
        onFinish={handleChangePasscode}
        initialValues={{}}
        autoComplete="off"
        layout={type === PASSCODE ? "vertical" : "horizontal"}>
        {type === PASSCODE && (
          <>
            <Form.Item
              label="Passcode hiện tại"
              name="passCode"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập passcode!",
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="Passcode mới"
              name="passCode"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập passcode!",
                },
              ]}>
              <Input />
            </Form.Item>
          </>
        )}

        {type === CAU_HINH && (
          <>
            <Form.Item
              name="ass"
              label="Loại chữ ký"
              labelCol={{
                span: 5,
              }}>
              <Radio.Group defaultValue="a">
                <Radio value="a">File chữ ký</Radio>
                <Radio value="b">SmartSign VNPT</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              labelCol={{
                span: 5,
              }}
              name="upload"
              label="Chọn file"
              valuePropName="fileList"
              // extra="longgggggggggggggggggggggggggggggggggg"
            >
              <Upload name="logo" listType="picture">
                <Button
                  className="d-flex align-items-center"
                  icon={<UploadOutlined />}>
                  Thêm file
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item
              labelCol={{
                span: 5,
              }}
              label="Mật khẩu"
              name="passCode"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập passcode!",
                },
              ]}>
              <Input.Password />
            </Form.Item>
          </>
        )}

        <div className="d-flex justify-content-center gap-3">
          <Form.Item>
            <Button type="ghost" htmlType="button" onClick={() => {}}>
              Bỏ qua
            </Button>
          </Form.Item>
          <Form.Item>
            <Button loading={false} type="primary" htmlType="submit">
              Đồng ý
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

const ThongSoChiTiet = ({
  currentUserDetail: data,
  setCurrentUserDetail,
  handleShowModalEdit,
}) => {
  const handleChangePasscode = async (values) => {};
  return (
    <>
      <_Modal type={CAU_HINH} />
      <div>
        <Button
          type="link"
          className="ms-3 mt-3"
          onClick={() => setCurrentUserDetail(null)}>
          Trở lại danh sách
        </Button>

        <div className="d-flex justify-content-center">
          <Button
            onClick={() => handleShowModalEdit(data)}
            className="d-flex align-items-center text-black"
            type="link"
            icon={<EditOutlined />}>
            Sửa thông số
          </Button>

          <Button
            className="d-flex align-items-center text-black"
            type="link"
            icon={<LockOutlined />}>
            Đổi passcode
          </Button>

          <Button
            className="d-flex align-items-center text-black"
            type="link"
            icon={<SettingOutlined />}>
            Cấu hình chữ ký
          </Button>

          <Button
            className="d-flex align-items-center text-black"
            type="link"
            icon={<HighlightOutlined />}>
            Ký thử
          </Button>

          <Button
            className="d-flex align-items-center text-black"
            type="link"
            icon={<HistoryOutlined />}>
            Lịch sử
          </Button>
        </div>

        <div className="mt-2" style={{ paddingInline: 40 }}>
          <Row label="Người ký">
            <div className="d-flex align-items-center">
              {/* <img
              className="me-2"
              src="https://joeschmoe.io/api/v1/random"
              height={40}
              width={40}
            /> */}
              <div>{data?.hoTen}</div>
            </div>
          </Row>

          <Row label="Trạng thái" even={false}>
            {data?.trangThai ? "Đang hiệu lực" : "Không hiệu lực"}
          </Row>

          <Row label="Lý do">{data?.lyDoMacDinh}</Row>

          <Row label="Hình 1" even={false}>
            {data?.hinh1 && (
              <img
                src={data.hinh1}
                style={{ height: "auto", width: "auto", maxHeight: 200 }}
              />
            )}
          </Row>
          <Row label="Hình 2">
            {data?.hinh2 && (
              <img
                src={data.hinh2}
                style={{ height: "auto", width: "auto", maxHeight: 200 }}
              />
            )}
          </Row>
          <Row label="Hình 3" even={false}>
            {data?.hinh3 && (
              <img
                src={data.hinh3}
                style={{ height: "auto", width: "auto", maxHeight: 200 }}
              />
            )}
          </Row>

          <Row label="Serial">{data?.serial}</Row>
          <Row label="Subject" even={false}>
            {data?.subject}
          </Row>
        </div>
      </div>
    </>
  );
};

export default ThongSoChiTiet;

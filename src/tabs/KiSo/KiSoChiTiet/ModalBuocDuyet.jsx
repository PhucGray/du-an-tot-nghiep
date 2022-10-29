import { Button, Form, Input, Modal, Select } from "antd";
import React from "react";

const { Option } = Select;

const ModalBuocDuyet = ({
  dsNguoiDungDuyet = [],
  onSubmit = () => {},
  loading = false,
  visible = false,
  onClose = () => {},
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={visible}
      title="Thêm bước duyệt"
      footer={null}
      onCancel={onClose}>
      <Form
        form={form}
        onFinish={onSubmit}
        name="buocduyet"
        layout="horizontal">
        <Form.Item
          labelCol={3}
          name="ten_Buoc"
          label="Tên bước"
          rules={[{ required: true, message: "Vui lòng nhập tên bước duyệt" }]}>
          <Input placeholder="Nhập tên bước" />
        </Form.Item>

        <Form.Item
          labelCol={3}
          name="ma_NguoiKy"
          label="Người ký"
          rules={[{ required: true, message: "Vui lòng chọn người ký" }]}>
          <Select placeholder="Chọn người ký">
            {dsNguoiDungDuyet.map((item) => (
              <Option value={item?.ma_NguoiDung}>{item?.hoTen}</Option>
            ))}
          </Select>
        </Form.Item>

        <div className="d-flex justify-content-center gap-3 mt-3">
          <Form.Item>
            <Button type="ghost" htmlType="button" onClick={onClose}>
              Bỏ qua
            </Button>
          </Form.Item>
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit">
              Đồng ý
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalBuocDuyet;

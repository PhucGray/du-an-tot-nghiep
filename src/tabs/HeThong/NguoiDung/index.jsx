import "../../../styles/tabs.scss";

import {
  Table,
  Tabs,
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Modal,
  Transfer,
  Spin,
  Radio,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getDsVaiTroSvc,
  suaVaiTroSvc,
  themVaiTroSvc,
  xoaVaiTroSvc,
} from "../../../store/vaitro/service";
import {
  getDsNguoiDungSvc,
  suaNguoiDungSvc,
  themNguoiDungSvc,
  xoaNguoiDungSvc,
} from "../../../store/nguoidung/service";
import { getDsChucDanhSvc } from "../../../store/chucdanh/service";
import {
  LOI,
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../constants/api";
import { toLowerCaseNonAccentVietnamese } from "../../../utils/strings";
import {
  ArrowDownOutlined,
  DoubleLeftOutlined,
  ArrowLeftOutlined,
  PlusSquareTwoTone,
} from "@ant-design/icons";
import { getDsQuyenSvc } from "../../../store/quyen/service";
import {
  getVaiTro_QuyenSvc,
  themVaiTro_QuyenSvc,
} from "../../../store/vaitro_quyen/service";
import { phoneRegex } from "../../../utils/regex";

const { TextArea } = Input;
const { Option } = Select;

export default () => {
  const [form] = Form.useForm();

  const [list, setList] = useState([]);
  const [subList, setSubList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [getListLoading, setGetListLoading] = useState(true);
  const [getSubListLoading, setGetSubListLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [addSubLoading, setAddSubLoading] = useState(false);

  const [listChucDanh, setListChucDanh] = useState([]);
  const [getListChucDanhLoading, setGetListChucDanhLoading] = useState(false);

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [editText, setNewEditText] = useState("");

  const [transferData, setTransferData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [finalKeys, setFinalKeys] = useState([]);
  const [isShowTransfer, setIsShowTransfer] = useState(false);

  const handleGetList = async () => {
    setGetListLoading(true);
    try {
      const res = await getDsNguoiDungSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        const list = res.data?.data
          ?.filter((i) => i?.isDeleted === false)
          ?.map((i) => {
            return {
              maSo: i?.ma_NguoiDung,
              itemName: i?.hoTen,
              key: i?.ma_NguoiDung,
              email: i?.email,
              sdt: i?.sdt,
            };
          });

        setList(list);
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setGetListLoading(false);
    }
  };

  const handleGetSubList = async (id = -1) => {
    setGetSubListLoading(true);

    try {
      const res = await getDsQuyenSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        const subList = res.data?.data
          ?.filter((i) => i?.isdeleted === false)
          ?.map((i) => {
            return {
              maSo: i?.ma_Quyen,
              itemName: i?.ten_Quyen,
              key: i?.ma_Quyen,
            };
          });

        const res_2 = await getVaiTro_QuyenSvc({ id });

        if (
          res_2.status === SUCCESS &&
          res_2.data?.retCode === RETCODE_SUCCESS
        ) {
          const selectedList = res_2.data?.data;
          setSubList(subList);
          getTransferData(subList, selectedList);
        }
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setGetSubListLoading(false);
    }
  };

  const handleAdd = async (values) => {
    // const data = { ...values, hoTen: values.itemName };
    // console.log({...values});
    // return;
    const data = {
      email: values.email,
      hoTen: values.itemName,
      sdt: values.sdt,
      diaChi: values.diaChi,
      gioiTinh: values.gioiTinh,
      ma_ChucDanh: values.ma_ChucDanh,
      passWord: values.passWord,
      retypePassWord: values.retypePassWord,
    };
    setAddLoading(true);
    try {
      const res = await themNguoiDungSvc(data);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
      } else {
        message.error(res.data?.retText);
      }
      form.resetFields();
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      const res = await xoaVaiTroSvc({ id: item.maSo });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        handleGetList();
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
    }
  };

  const handleEdit = async () => {
    setEditLoading(true);
    try {
      const res = await suaVaiTroSvc({
        ma_Role: selectedItem?.maSo,
        ten_Role: editText,
      });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        handleGetList();
        setModalEditVisible(false);
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setEditLoading(false);
    }
  };

  const handleSearch = (keyword) => {
    setKeyword(keyword);

    setSearchList(
      [...list].filter((i) =>
        toLowerCaseNonAccentVietnamese(i?.itemName).includes(
          toLowerCaseNonAccentVietnamese(keyword),
        ),
      ),
    );
  };

  const getTransferData = (list, selectedList = []) => {
    const targetKeys = [];
    const transferData = [];

    for (let i = 0; i < list.length - 1; i++) {
      const item = list[i];

      const data = {
        key: item?.key,
        title: item?.itemName,
        chosen: selectedList.find((i) => i?.ma_Quyen === item?.key),
      };

      if (!data.chosen) {
        targetKeys.push(data.key);
      }
      transferData.push(data);
    }

    setTransferData(transferData);
    setTargetKeys(targetKeys);
  };

  const handleTransfer = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
    setFinalKeys(
      transferData
        .filter((i) => !newTargetKeys?.includes(i?.key))
        .map((i) => i.key),
    );
  };

  const handleAddVaiTro_Quyen = async () => {
    setAddSubLoading(true);

    try {
      const res = await themVaiTro_QuyenSvc({
        id_Role: selectedItem?.maSo,
        quyens: finalKeys.map((item) => {
          return {
            id_Quyen: item,
          };
        }),
      });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setAddSubLoading(false);
    }
  };

  const handleGetListChucDanh = async () => {
    setGetListChucDanhLoading(true);
    try {
      const res = await getDsChucDanhSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setListChucDanh(
          res.data?.data
            ?.filter((i) => i?.isDeleted === false)
            ?.map((i) => {
              return {
                maSo: i?.ma_ChucDanh,
                tenChucDanh: i?.ten_ChucDanh,
                thuTu: i?.order,
                key: i?.ma_ChucDanh,
              };
            }),
        );
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setGetListChucDanhLoading(false);
    }
  };

  useEffect(() => {
    handleGetList();
    handleGetListChucDanh();
  }, []);

  const columns = [
    {
      title: "Mã số",
      dataIndex: "maSo",
      key: "maSo",
    },
    {
      title: "Họ và tên",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "sdt",
      key: "sdt",
    },
    {
      title: "Hành động",
      key: "hanhDong",
      render: (_, record) => (
        <div>
          <div>
            <div className="d-flex">
              <Button type="link">Chi tiết</Button>
              <Button
                onClick={() => {
                  setSelectedItem(record);
                  setModalEditVisible(true);
                }}
                type="link">
                Sửa
              </Button>

              <Popconfirm
                title="Bạn có chắc chắn muốn xoá?"
                onConfirm={() => handleDelete(record)}
                okText="Đồng ý"
                cancelText="Thoát">
                <Button type="link">Xoá</Button>
              </Popconfirm>
            </div>

            <div className="d-flex">
              <Button
                type="link"
                onClick={() => {
                  setSelectedItem(record);
                  setIsShowTransfer(true);
                  handleGetSubList(record?.maSo);
                }}>
                Vai trò
              </Button>

              <Button
                type="link"
                onClick={() => {
                  setSelectedItem(record);
                  setIsShowTransfer(true);
                  handleGetSubList(record?.maSo);
                }}>
                Phân nhóm
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="crud">
      <Tabs
        defaultActiveKey="2"
        style={{ width: "95%", marginInline: "auto" }}
        onChange={(activeKey) => {
          if (activeKey == 1) {
            handleGetList();
          }
        }}>
        <Tabs.TabPane tab={isShowTransfer ? "Phân quyền" : "Danh sách"} key="1">
          {isShowTransfer ? (
            <div>
              <div className="mt-2 mb-4 d-flex justify-content-between">
                <Button
                  type="link"
                  className="d-flex align-items-center"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => {
                    handleGetList();
                    setIsShowTransfer(false);
                  }}>
                  Danh sách
                </Button>

                <div>Vai trò hiện tại: {selectedItem?.itemName}</div>
              </div>

              {getSubListLoading ? (
                <div className="d-flex justify-content-center">
                  <Spin className="mt-4 mb-3" />
                </div>
              ) : (
                <div className="d-flex flex-column align-items-center mt-2">
                  <div className="d-flex align-items-center justify-content-center gap-5">
                    <div>Quyền đã có</div>
                    <DoubleLeftOutlined />
                    <div>Quyền chưa có</div>
                  </div>

                  <Transfer
                    dataSource={transferData}
                    listStyle={{
                      width: 250,
                      height: 350,
                      marginTop: 10,
                    }}
                    targetKeys={targetKeys}
                    onChange={handleTransfer}
                    render={(item) => `${item.title}`}
                  />

                  <Button
                    type="primary"
                    className="mt-3"
                    loading={addSubLoading}
                    onClick={handleAddVaiTro_Quyen}>
                    Xác nhận
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div style={{}}>
              <div className="mt-2 mb-4 d-flex justify-content-between">
                <Input
                  style={{ width: 200 }}
                  placeholder="Nhập từ khoá tìm kiếm"
                  value={keyword}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Table
                loading={getListLoading}
                columns={columns}
                dataSource={keyword.trim() ? searchList : list}
                pagination={{ defaultPageSize: 5 }}
              />
            </div>
          )}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Thêm người dùng" key="2">
          <Form
            form={form}
            className="mx-auto mt-3"
            name="basic"
            onFinish={handleAdd}
            autoComplete="off"
            layout="vertical">
            <div className="d-flex justify-content-center w-75 mx-auto gap-3">
              <Form.Item
                style={{ width: "40%" }}
                label="Tên người dùng"
                name="itemName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên người dùng!",
                  },
                ]}>
                <Input placeholder="Nhập tên người dùng" />
              </Form.Item>

              <Form.Item
                style={{ width: "40%" }}
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
                <Input placeholder="Nhập email" />
              </Form.Item>
            </div>

            <div className="d-flex justify-content-center w-75 mx-auto gap-3">
              <Form.Item
                style={{ width: "40%" }}
                label="Số điện thoại"
                name="sdt"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại!",
                  },
                  {
                    pattern: phoneRegex,
                    message: "Số điện thoại sai định dạng",
                  },
                ]}>
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                style={{ width: "40%" }}
                name="gioiTinh"
                label="Giới tính"
                initialValue={true}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn giới tính!",
                  },
                ]}>
                <Radio.Group>
                  <Radio value={true}>Nam</Radio>
                  <Radio value={false}>Nữ</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            <div className="d-flex justify-content-center w-75 mx-auto gap-3">
              <Form.Item
                style={{ width: "40%" }}
                label="Mật khẩu"
                name="passWord"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                  {
                    min: 6,
                    message: "Nhập mật khẩu ít nhất 6 ký tự",
                  },
                ]}>
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item
                style={{ width: "40%" }}
                label="Nhập lại mật khẩu"
                name="retypePassWord"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập lại mật khẩu!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("passWord") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu không trùng khớp!"),
                      );
                    },
                  }),
                ]}>
                <Input.Password placeholder="Xác nhận mật khẩu" />
              </Form.Item>
            </div>

            <div className="d-flex justify-content-center w-75 mx-auto gap-3">
              <Form.Item
                style={{ width: "40%" }}
                label="Địa chỉ"
                name="diaChi"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ!",
                  },
                ]}>
                <TextArea placeholder="Nhập địa chỉ" style={{ height: 100 }} />
              </Form.Item>

              <Form.Item
                style={{ width: "40%" }}
                label="Chức danh"
                name="ma_ChucDanh"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn chức danh!",
                  },
                ]}>
                <Select
                  placeholder="Chọn chức danh"
                  style={{
                    width: "100%",
                  }}>
                  {listChucDanh.map((item, index) => (
                    <Option key={index} value={item?.maSo}>
                      {item?.tenChucDanh}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {/* <div style={{ width: "40%" }}>
                <div className="ant-col ant-form-item-label">Chức danh</div>
                <div>
                  <Select
                    placeholder="Chọn chức danh"
                    style={{
                      width: "100%",
                    }}
                    onChange={() => {}}>
                    {listChucDanh.map((item, index) => (
                      <Option key={index} value="jack">
                        {item?.tenChucDanh}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div> */}

              {/* <div style={{ width: "40%" }}>
                <div className="ant-col ant-form-item-label">Ảnh đại diện</div>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    border: "1px dashed #7a7a7a",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}>
                  <PlusSquareTwoTone />
                </div>
              </div> */}
            </div>

            <div className="d-flex justify-content-center w-75 mx-auto gap-3">
              <div style={{ width: "40%" }}>
                <div className="ant-col ant-form-item-label">Ảnh đại diện</div>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    border: "1px dashed #7a7a7a",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}>
                  <PlusSquareTwoTone />
                </div>
              </div>

              <div style={{ width: "40%" }}></div>
            </div>

            <div className="d-flex justify-content-center mt-3 mb-5">
              <Button
                loading={addLoading}
                type="primary"
                htmlType="submit"
                className="submit-btn w-25">
                Thêm
              </Button>
            </div>
          </Form>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title="Sửa chức danh"
        open={modalEditVisible}
        confirmLoading={editLoading}
        okText="Sửa"
        onOk={handleEdit}
        okButtonProps={{ disabled: !editText.trim() }}
        onCancel={() => {
          setModalEditVisible(false);
        }}>
        <Input value={selectedItem?.itemName} disabled />

        <div className="text-center mb-3 mt-2">
          <ArrowDownOutlined />
        </div>

        <Input
          autoFocus
          value={editText}
          onChange={(e) => setNewEditText(e.target.value)}
        />
      </Modal>
    </div>
  );
};

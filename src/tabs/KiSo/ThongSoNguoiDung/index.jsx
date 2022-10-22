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
  Checkbox,
  Upload,
  Row,
  Col,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  LOI,
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../constants/api";
import { toLowerCaseNonAccentVietnamese } from "../../../utils/strings";
import {
  ArrowLeftOutlined,
  CheckCircleTwoTone,
  HourglassTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import {
  handleUploadImage,
  uploadBase64Image,
  uploadBlobToStorage,
  uploadImageToStorage,
} from "../../../utils/images";
import {
  getListNguoiDungDuyetSvc,
  getListThongSoKiSo,
  suaNguoiDungDuyetSvc,
  themNguoiDungDuyetSvc,
  xoaThongSoNguoiDung,
} from "../../../store/kyso_thongso/services";
import { useSelector } from "react-redux";
import { nguoiDungSelector } from "../../../store/auth/selectors";
import moment from "moment";
import ThongSoChiTiet from "./ThongSoChiTiet";

const { Option } = Select;

export default () => {
  const [form] = Form.useForm();
  const nguoiDung = useSelector(nguoiDungSelector);

  const [isEdit, setIsEdit] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [getListLoading, setGetListLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [change1, setChange1] = useState(false);
  const [change2, setChange2] = useState(false);
  const [change3, setChange3] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [list, setList] = useState([
    {
      maSo: 1,
      hoVaTen:
        "Nguyen Van A ahwfbhaw bwah fbhwakbfhbawhkfb hakwbf hkawbf hkawbhk fbahw",
      chucDanh: "Tổng giám đốc",
      hetHan: "20-10-2022",
      kiThu: false,
      trangThai: true,
    },
    {
      maSo: 2,
      hoVaTen: "Nguyen Van A",
      chucDanh: "Tổng giám đốc",
      hetHan: "20-10-2022",
      kiThu: true,
      trangThai: false,
    },
  ]);
  const [searchList, setSearchList] = useState([]);

  const [listNguoiCanDuyet, setListNguoiCanDuyet] = useState([]);
  const [themNguoiDungDuyetLoading, setThemNguoiDungDuyetLoading] =
    useState(false);

  const [currentUserDetail, setCurrentUserDetail] = useState(null);

  const getListThongSo = async () => {
    setGetListLoading(true);
    try {
      const res = await getListThongSoKiSo();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setList(
          res.data?.data?.map((item) => {
            return {
              ...item,
              itemName: item?.nguoiDung?.hoTen,
              ma_NguoiDung: item?.nguoiDung?.ma_NguoiDung,
              hoTen: item?.nguoiDung?.hoTen,
              ten_ChucDanh: item?.nguoiDung?.chucDanh?.ten_ChucDanh,
              ngayChuKyHetHan: item?.ngayChuKyHetHan,
              isThongSo: item?.nguoiDung?.isThongSo,
              trangThai: item?.trangThai,
            };
          }),
        );
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setGetListLoading(false);
    }
  };
  const getListNguoiDungCanDuyet = async () => {
    try {
      const res = await getListNguoiDungDuyetSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setListNguoiCanDuyet(res.data?.data);
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
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

  const handleAdd = async (values) => {
    setThemNguoiDungDuyetLoading(true);
    let hinh2 = null;
    let hinh3 = null;
    if (!!values?.hinh2) {
      hinh2 = await uploadBase64Image(values?.hinh2?.file?.thumbUrl);
    }
    if (!!values?.hinh3) {
      hinh3 = await uploadBase64Image(values?.hinh3?.file?.thumbUrl);
    }

    let hinh1 = await uploadBase64Image(values?.hinh1?.file?.thumbUrl);
    const new3Months = moment().add(3, "months").format();
    const data = {
      ma_NguoiDung: values?.ma_NguoiDung,
      hinh1,
      hinh2,
      hinh3,
      lyDoMacDinh: values.lyDoMacDinh,
      passCode: values.passCode,
      retypePasscode: values.passCode,
      ma_NguoiCapNhatCuoi: nguoiDung?.ma_NguoiDung,
      trangThai: values?.trangThai,
      ngayChuKyHetHan: new3Months,
    };
    try {
      const res = await themNguoiDungDuyetSvc(data);
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setIsModalOpen(false);
        getListThongSo();
        message.success(res.data?.retText);
        form.resetFields();
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setThemNguoiDungDuyetLoading(false);
      setChange1(false);
      setChange2(false);
      setChange3(false);
    }
  };

  const handleEdit = async (values) => {
    setThemNguoiDungDuyetLoading(true);
    let hinh1 = null;
    let hinh2 = null;
    let hinh3 = null;

    if (!!values?.hinh1 && !!values?.hinh1?.file) {
      hinh1 = await uploadBase64Image(values?.hinh1?.file?.thumbUrl);
    } else if (!!values?.hinh1) {
      hinh1 = values.hinh1;
    }

    if (!!values?.hinh2 && !!values?.hinh2?.file) {
      console.log(values?.hinh2?.file);
      hinh2 = await uploadBase64Image(values?.hinh2?.file?.thumbUrl);
    } else if (!!values?.hinh2) {
      hinh2 = values.hinh2;
    }

    if (!!values?.hinh3 && !!values?.hinh3?.file) {
      hinh3 = await uploadBase64Image(values?.hinh3?.file?.thumbUrl);
    } else if (!!values?.hinh3) {
      hinh3 = values.hinh3;
    }

    const data = {
      ma_NguoiDung: values?.ma_NguoiDung,
      hinh1,
      hinh2,
      hinh3,
      lyDoMacDinh: values.lyDoMacDinh,
      ma_NguoiCapNhatCuoi: nguoiDung?.ma_NguoiDung,
      trangThai: values?.trangThai,
    };

    try {
      const res = await suaNguoiDungDuyetSvc(data);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setIsModalOpen(false);
        getListThongSo();
        message.success(res.data?.retText);
        form.resetFields();
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setThemNguoiDungDuyetLoading(false);
      setChange1(false);
      setChange2(false);
      setChange3(false);
    }
  };

  const handleDelete = async (nguoiDung) => {
    try {
      const res = await xoaThongSoNguoiDung({ id: nguoiDung?.ma_NguoiDung });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        getListThongSo();
        getListNguoiDungCanDuyet();
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    }
  };

  const handleShowModalEdit = (info) => {
    setIsModalOpen(true);
    setIsEdit(true);
    const item = list.find((i) => i.ma_NguoiDung === info?.ma_NguoiDung);

    const nguoiDung = item?.nguoiDung;

    form.setFieldValue("trangThai", item?.trangThai);
    form.setFieldValue("lyDoMacDinh", item?.lyDoMacDinh);
    form.setFieldValue("hinh1", item?.hinh1);
    form.setFieldValue("hinh2", item?.hinh2);
    form.setFieldValue("hinh3", item?.hinh3);
    form.setFieldValue("ma_NguoiDung", nguoiDung?.ma_NguoiDung);
  };

  const columns = [
    {
      title: "Mã số",
      dataIndex: "ma_NguoiDung",
      key: "ma_NguoiDung",
    },
    {
      title: "Họ và tên",
      dataIndex: "hoTen",
      key: "hoTen",
    },
    {
      title: "Chức danh",
      dataIndex: "ten_ChucDanh",
      key: "ten_ChucDanh",
    },
    {
      title: "Hết hạn",
      dataIndex: "ngayChuKyHetHan",
      key: "ngayChuKyHetHan",
    },
    {
      title: "Ký thử",
      dataIndex: "isThongSo",
      key: "isThongSo",
      render: (_, record) => {
        return (
          <div className="text-center">
            {record?.isThongSo ? (
              <CheckCircleTwoTone twoToneColor="#00d447" />
            ) : (
              <HourglassTwoTone />
            )}
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (_, record) => {
        return (
          <div className="text-center">
            {record?.trangThai ? "Đang hiệu lực" : "Không hiệu lực"}
          </div>
        );
      },
    },
    {
      title: "Hành động",
      key: "hanhDong",
      render: (_, record) => (
        <div>
          <div>
            {/* <Button
              type="link"
              onClick={() => {
                setIsModalOpen(true);
                setIsEdit(true);
                const item = list.find(
                  (i) => i.ma_NguoiDung === record?.ma_NguoiDung,
                );

                const nguoiDung = item?.nguoiDung;

                form.setFieldValue("trangThai", item?.trangThai);
                form.setFieldValue("lyDoMacDinh", item?.lyDoMacDinh);
                form.setFieldValue("hinh1", item?.hinh1);
                form.setFieldValue("hinh2", item?.hinh2);
                form.setFieldValue("hinh3", item?.hinh3);
                form.setFieldValue("ma_NguoiDung", nguoiDung?.ma_NguoiDung);
              }}>
              Sửa
            </Button> */}
            <Button
              type="link"
              onClick={() => {
                setCurrentUserDetail(record);
              }}>
              Chi tiết
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn xoá?"
              onConfirm={() => handleDelete(record)}
              okText="Đồng ý"
              cancelText="Thoát">
              <Button type="link">Xoá</Button>
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getListThongSo();
    getListNguoiDungCanDuyet();
  }, []);

  // if (!!currentUserDetail)
  //   return (
  //     <ThongSoChiTiet
  //       currentUserDetail={currentUserDetail}
  //       setCurrentUserDetail={setCurrentUserDetail}
  //     />
  //   );

  return (
    <>
      <Modal
        title={isEdit ? "Sửa thông số" : "Thêm thông số"}
        open={isModalOpen}
        onOk={() => {}}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEdit(false);
          setIsDetail(false);
          form.resetFields();
        }}
        footer={null}>
        <Form
          disabled={isDetail}
          form={form}
          name="suathongso"
          onFinish={isEdit ? handleEdit : handleAdd}
          initialValues={{
            hinh2: null,
            hinh3: null,
            trangThai: true,
          }}
          autoComplete="off">
          <Form.Item
            labelCol={{
              span: 5,
            }}
            label="Người Ký"
            name="ma_NguoiDung"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn người Ký!",
              },
            ]}>
            <Select
              disabled={isEdit}
              placeholder="Chọn người Ký"
              style={{
                width: "100%",
              }}>
              {listNguoiCanDuyet.map((item, index) => (
                <Option key={index} value={item?.ma_NguoiDung}>
                  {item?.hoTen}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 5,
            }}
            label="Trạng thái"
            name="trangThai"
            valuePropName="checked"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn trạng thái!",
              },
            ]}>
            <Checkbox>Hiệu lực</Checkbox>
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 5,
            }}
            label="Lý do"
            name="lyDoMacDinh"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lý do!",
              },
            ]}>
            <Input />
          </Form.Item>

          {!isEdit && (
            <Form.Item
              labelCol={{
                span: 5,
              }}
              label="Passcode"
              name="passCode"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập passcode!",
                },
              ]}>
              <Input />
            </Form.Item>
          )}

          <div className="d-flex justify-content-around">
            <div>
              <Form.Item
                className="mb-0"
                name="hinh1"
                label="Hình 1"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn hình ",
                  },
                ]}>
                <Upload
                  listType="picture"
                  multiple={false}
                  onChange={() => {
                    setChange1(true);
                  }}>
                  <Button
                    icon={<UploadOutlined />}
                    className="d-flex align-items-center">
                    Chọn {!!form.getFieldValue("hinh1") ? "lại" : "hình"}
                  </Button>
                </Upload>
              </Form.Item>
              {!change1 && !!form.getFieldValue("hinh1") && (
                <div className="d-flex justify-content-center">
                  <img
                    src={form.getFieldValue("hinh1")}
                    height={40}
                    width={40}
                  />
                </div>
              )}
            </div>

            <div>
              <Form.Item name="hinh2" label="Hình 2">
                <Upload
                  name="hinh2"
                  listType="picture"
                  multiple={false}
                  onChange={() => {
                    setChange2(true);
                  }}>
                  <Button
                    icon={<UploadOutlined />}
                    className="d-flex align-items-center">
                    Chọn {!!form.getFieldValue("hinh2") ? "lại" : "hình"}
                  </Button>
                </Upload>
              </Form.Item>
              {!change2 && !!form.getFieldValue("hinh2") && (
                <div className="d-flex justify-content-center">
                  <img
                    src={form.getFieldValue("hinh2")}
                    height={40}
                    width={40}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-around">
            <div style={{ marginLeft: 10 }}>
              <Form.Item name="hinh3" label="Hình 3">
                <Upload
                  name="hinh3"
                  listType="picture"
                  multiple={false}
                  onChange={() => {
                    setChange3(true);
                  }}>
                  <Button
                    icon={<UploadOutlined />}
                    className="d-flex align-items-center">
                    Chọn {!!form.getFieldValue("hinh3s") ? "lại" : "hình"}
                  </Button>
                </Upload>
              </Form.Item>
              {!change3 && !!form.getFieldValue("hinh3") && (
                <div className="d-flex justify-content-center">
                  <img
                    src={form.getFieldValue("hinh3")}
                    height={40}
                    width={40}
                  />
                </div>
              )}
            </div>

            <div style={{ opacity: 0, pointerEvents: "none" }}>
              <Form.Item label="Hình 3">
                <Upload listType="picture">
                  <Button
                    icon={<UploadOutlined />}
                    className="d-flex align-items-center">
                    Chọn hình
                  </Button>
                </Upload>
              </Form.Item>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <Form.Item>
              <Button
                type="ghost"
                htmlType="button"
                onClick={() => setIsModalOpen(false)}>
                Bỏ qua
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                loading={themNguoiDungDuyetLoading}
                type="primary"
                htmlType="submit">
                Đồng ý
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {currentUserDetail ? (
        <ThongSoChiTiet
          handleShowModalEdit={handleShowModalEdit}
          currentUserDetail={currentUserDetail}
          setCurrentUserDetail={setCurrentUserDetail}
        />
      ) : (
        <div style={{ width: "95%", marginInline: "auto" }}>
          <div className="mt-4 mb-4 d-flex justify-content-between align-items-center">
            <Input
              style={{ width: 200 }}
              placeholder="Nhập từ khoá tìm kiếm"
              value={keyword}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <Button
              type="primary"
              onClick={() => {
                setIsModalOpen(true);
              }}>
              Thêm
            </Button>
          </div>

          <div>
            <Table
              loading={getListLoading}
              columns={columns}
              dataSource={keyword.trim() ? searchList : list}
              pagination={{ defaultPageSize: 5 }}
            />
          </div>
        </div>
      )}
    </>
  );
};

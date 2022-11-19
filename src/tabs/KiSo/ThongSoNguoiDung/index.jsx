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
  uploadImagToFirebase,
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
import { useRef } from "react";
import ReactImageSize from "react-image-size";
import ImageModal from "./ImageModal";
import { transformUser } from "../../../utils/user";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as TAB from "../../../constants/tab";
import { API_DOMAIN } from "../../../configs/api";
import { useMemo } from "react";

const { Option } = Select;

const KICH_THUOC_QUA_LON = "Kích thước ảnh quá lớn";
const VUI_LONG_CHON_HINH = "Vui lòng chọn hình";

export default () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  // const [isDetail, setisDetail] = useState(() => !!params?.id && location.pathname?.includes("detail"))
  const isDetail = useMemo(() => {
    return !!params?.id && location.pathname?.includes("detail")
  }, [location.pathname])

  // console.log(isDetail)


  const [form] = Form.useForm();
  const nguoiDung = useSelector(nguoiDungSelector);

  const [isEdit, setIsEdit] = useState(false);
  // const [isDetail, setIsDetail] = useState(false);
  const [getListLoading, setGetListLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [change1, setChange1] = useState(false);
  const [change2, setChange2] = useState(false);
  const [change3, setChange3] = useState(false);

  const file1Ref = useRef();
  const file2Ref = useRef();
  const file3Ref = useRef();

  const [hinh1, setHinh1] = useState(null);
  const [hinh2, setHinh2] = useState(null);
  const [hinh3, setHinh3] = useState(null);

  const [hinh1Error, setHinh1Error] = useState("");
  const [hinh2Error, setHinh2Error] = useState("");
  const [hinh3Error, setHinh3Error] = useState("");

  const [hinh1Loading, setHinh1Loading] = useState(false);
  const [hinh2Loading, setHinh2Loading] = useState(false);
  const [hinh3Loading, setHinh3Loading] = useState(false);

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
        const list = res.data?.data?.map((item) => {
          return transformUser(item);
        });

        setList(list);

        const currentUser = list?.find((u) => u?.ma_NguoiDung == params?.id);

        // console.log(currentUser?.hinh1)
        // console.log(currentUser?.hinh2)
        // console.log(currentUser?.hinh3)
        // console.log({...currentUser, 
        //   hinh1: currentUser?.hinh1 ? API_DOMAIN + currentUser?.hinh1 : null,
        //   hinh2: currentUser?.hinh2 ? API_DOMAIN + currentUser?.hinh2 : null,
        //   hinh3: currentUser?.hinh3 ? API_DOMAIN + currentUser?.hinh3 : null,
        // })
        // console.log(isDetail)
        // console.log(  {...currentUser, 
        //   hinh1: currentUser?.hinh1 ? API_DOMAIN + currentUser?.hinh1?.split("\\").join('/') : null,
        //   hinh2: currentUser?.hinh2 ? API_DOMAIN + currentUser?.hinh2?.split("\\").join('/') : null,
        //   hinh3: currentUser?.hinh3 ? API_DOMAIN + currentUser?.hinh3?.split("\\").join('/') : null,
        // },)

        if (isDetail) {
         
          setCurrentUserDetail(
            {...currentUser, 
              hinh1: currentUser?.hinh1 ? API_DOMAIN + currentUser?.hinh1?.split("\\").join('/') : null,
              hinh2: currentUser?.hinh2 ? API_DOMAIN + currentUser?.hinh2?.split("\\").join('/') : null,
              hinh3: currentUser?.hinh3 ? API_DOMAIN + currentUser?.hinh3?.split("\\").join('/') : null,
            },
          );
        }
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
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
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
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
    let isValid = true;

    if (!isValid) return;

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
        setHinh1(null)
        setHinh2(null)
        setHinh3(null)
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setThemNguoiDungDuyetLoading(false);
      setChange1(false);
      setChange2(false);
      setChange3(false);
    }
  };

  const handleEdit = async (values) => {
    setThemNguoiDungDuyetLoading(true);

    const data = {
      ma_NguoiDung: values?.ma_NguoiDung,
      hinh1:hinh1?.includes(API_DOMAIN) ? null : hinh1, 
      hinh2:hinh2?.includes(API_DOMAIN) ? null : hinh2, 
      hinh3:hinh3?.includes(API_DOMAIN) ? null : hinh3, 
      lyDoMacDinh: values.lyDoMacDinh,
      ma_NguoiCapNhatCuoi: nguoiDung?.ma_NguoiDung,
      trangThai: values?.trangThai,
    };

    try {
      const res = await suaNguoiDungDuyetSvc(data);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setIsModalOpen(false);

        const currentUser = res?.data?.data;
       
        setCurrentUserDetail(
          {...currentUser, 
            hinh1: currentUser?.hinh1 ? API_DOMAIN + currentUser?.hinh1?.split("\\").join('/') : null,
            hinh2: currentUser?.hinh2 ? API_DOMAIN + currentUser?.hinh2?.split("\\").join('/') : null,
            hinh3: currentUser?.hinh3 ? API_DOMAIN + currentUser?.hinh3?.split("\\").join('/') : null,
          },
        );
        message.success(res.data?.retText);
        window.location.reload();
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setThemNguoiDungDuyetLoading(false);
      // setChange1(false);
      // setChange2(false);
      // setChange3(false);
    }
  };

  const handleDelete = async (nguoiDung) => {
    try {
      const res = await xoaThongSoNguoiDung({ id: nguoiDung?.ma_NguoiDung });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        getListThongSo();
        getListNguoiDungCanDuyet();
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    }
  };

  const handleShowModalEdit = (info) => {
    setIsModalOpen(true);
    setIsEdit(true);
    const item = list.find((i) => i.ma_NguoiDung === info?.ma_NguoiDung);

    form.setFieldValue("trangThai", item?.trangThai);
    form.setFieldValue("lyDoMacDinh", item?.lyDoMacDinh);
    form.setFieldValue("hinh1",API_DOMAIN +  item?.hinh1);
    form.setFieldValue("hinh2",API_DOMAIN +  item?.hinh2);
    form.setFieldValue("hinh3",API_DOMAIN +  item?.hinh3);
    form.setFieldValue("ma_NguoiDung", item?.ma_NguoiDung);

    setHinh1(item?.hinh1 ? (API_DOMAIN +  item?.hinh1) : null);
    setHinh2(item?.hinh2 ? (API_DOMAIN +  item?.hinh2) : null);
    setHinh3(item?.hinh3 ? (API_DOMAIN +  item?.hinh3) : null);
  }
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
      render: (_, record) => {
        return (
          <div>
            <div style={{fontSize: 16}}>{record?.hoTen}</div>
            {!!record?.serial && <div style={{fontSize: 12, color: 'blue'}}>Serial: {record?.serial}</div>}
            {!!record?.subject && <div style={{fontSize: 12, color: 'blue'}}>Subject: {record?.subject}</div>}
          </div>
        );
      },
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
            <Button
              type="link"
              onClick={() => {
                // setCurrentUserDetail(record);
                navigate(
                  "/" +
                    TAB.THONG_SO_NGUOI_DUNG +
                    "/detail/" +
                    record?.ma_NguoiDung,
                );
                // setisDetail(true)
                // window.location.reload();
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
  }, [location.pathname]);

  return (
    <>
      <Modal
        title={isEdit ? "Sửa thông số" : "Thêm thông số"}
        open={isModalOpen}
        onOk={() => {}}
        onCancel={() => {
          if (hinh1Loading || hinh2Loading || hinh3Loading) return;

          setIsModalOpen(false);
          setIsEdit(false);
          form.resetFields();
          setHinh1(null);
          setHinh2(null);
          setHinh3(null);
          setHinh1Error(false);
        }}
        footer={null}>
        <Form
          // disabled={isDetail}
          form={form}
          name="suathongso"
          onFinish={(e) => {
            if (!hinh1) {
              setHinh1Error(VUI_LONG_CHON_HINH);
              return;
            }

            isEdit ? handleEdit(e) : handleAdd(e);
          }}
          onFinishFailed={() => {
            if (!hinh1) {
              setHinh1Error(VUI_LONG_CHON_HINH);
              return;
            }
          }}
          initialValues={{
            hinh1: null,
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
              {isEdit
                ? list.map((item, index) =>{
                  return (
                    <Option key={index} value={item?.ma_NguoiDung}>
                    {item?.nguoiDung?.hoTen}
                  </Option>
                  )
                })
                : listNguoiCanDuyet.map((item, index) => (
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
            name="lyDoMacDinh">
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
              <Input.Password/>
            </Form.Item>
          )}

          <ImageModal
            number={1}
            required
            onClick={() => file1Ref.current?.click()}
            error={hinh1Error}
            image={hinh1}
            loading={hinh1Loading}
          />
          <ImageModal
            number={2}
            onClick={() => file2Ref.current?.click()}
            error={hinh2Error}
            image={hinh2}
            loading={hinh2Loading}
          />
          <ImageModal
            number={3}
            onClick={() => file3Ref.current?.click()}
            error={hinh3Error}
            image={hinh3}
            loading={hinh3Loading}
          />

          <div className="d-flex justify-content-center gap-3 mt-3">
            <Form.Item>
              <Button
                type="ghost"
                htmlType="button"
                onClick={() => {
                  if (hinh1Loading || hinh2Loading || hinh3Loading) return;
                  setIsModalOpen(false);
                }}>
                Bỏ qua
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                loading={
                  themNguoiDungDuyetLoading ||
                  hinh1Loading ||
                  hinh2Loading ||
                  hinh3Loading
                }
                type="primary"
                htmlType="submit">
                Đồng ý
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <input
        className="position-fixed"
        style={{ top: -1000, opacity: 0 }}
        type="file"
        ref={file1Ref}
        onChange={async (e) => {
          setHinh1Error(null);
          setHinh1Loading(true);

          const hinh1 = await uploadImagToFirebase(e);
          const { width, height } = await ReactImageSize(hinh1);
          if (width > 250 || height > 250) {
            setHinh1Error(KICH_THUOC_QUA_LON);
          } else {
            setHinh1(hinh1);
          }

          setHinh1Loading(false);
        }}
      />

      <input
        className="position-fixed"
        style={{ top: -1000, opacity: 0 }}
        type="file"
        ref={file2Ref}
        onChange={async (e) => {
          setHinh2Error(null);
          setHinh2Loading(true);

          const hinh2 = await uploadImagToFirebase(e);
          const { width, height } = await ReactImageSize(hinh2);
          if (width > 250 || height > 250) {
            setHinh2Error(KICH_THUOC_QUA_LON);
          } else {
            setHinh2(hinh2);
          }

          setHinh2Loading(false);
        }}
      />

      <input
        className="position-fixed"
        style={{ top: -1000, opacity: 0 }}
        type="file"
        ref={file3Ref}
        onChange={async (e) => {
          setHinh3Error(null);
          setHinh3Loading(true);

          const hinh3 = await uploadImagToFirebase(e);
          const { width, height } = await ReactImageSize(hinh3);
          if (width > 250 || height > 250) {
            setHinh3Error(KICH_THUOC_QUA_LON);
          } else {
            setHinh3(hinh3);
          }

          setHinh3Loading(false);
        }}
      />

      {isDetail ? (
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

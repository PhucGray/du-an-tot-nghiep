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
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getDsQuyenSvc,
  suaQuyenSvc,
  themQuyenSvc,
  xoaQuyenSvc,
} from "../../../store/quyen/service";
import {
  LOI,
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../constants/api";
import { toLowerCaseNonAccentVietnamese } from "../../../utils/strings";
import { ArrowDownOutlined, DoubleLeftOutlined } from "@ant-design/icons";

export default () => {
  const [form] = Form.useForm();

  const [list, setList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [getListLoading, setGetListLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [editText, setNewEditText] = useState("");

  const handleGetList = async () => {
    setGetListLoading(true);
    try {
      const res = await getDsQuyenSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setList(
          res.data?.data
            ?.filter((i) => i?.isdeleted === false)
            ?.map((i) => {
              return {
                maSo: i?.ma_Quyen,
                itemName: i?.ten_Quyen,
                key: i?.ma_Quyen,
              };
            }),
        );
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setGetListLoading(false);
    }
  };

  const handleAdd = async (values) => {
    setAddLoading(true);
    try {
      const res = await themQuyenSvc({ ten_Quyen: values.itemName });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        form.resetFields(["itemName"]);
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      const res = await xoaQuyenSvc({ id: item.maSo });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        handleGetList();
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
    }
  };

  const handleEdit = async () => {
    setEditLoading(true);
    try {
      const res = await suaQuyenSvc({
        ma_Quyen: selectedItem?.maSo,
        ten_Quyen: editText,
      });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        handleGetList();
        setModalEditVisible(false);
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
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

  useEffect(() => {
    handleGetList();
  }, []);

  const columns = [
    {
      title: "Mã số",
      dataIndex: "maSo",
      key: "maSo",
    },
    {
      title: "Tên quyền",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Hành động",
      key: "hanhDong",
      render: (_, record) => (
        <div>
          <div>
            <Button
              onClick={() => {
                setSelectedItem(record);
                setModalEditVisible(true);
              }}
              type="link">
              Sửa
            </Button>
            <Button type="link">Chi tiết</Button>
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
  return (
    <div className="vai-tro">
      <Tabs
        defaultActiveKey="1"
        style={{ width: "95%", marginInline: "auto" }}
        onChange={(activeKey) => {
          if (activeKey == 1) {
            handleGetList();
          }
        }}>
        <Tabs.TabPane tab="Danh sách" key="1">
          <div style={{}}>
            <div className="mt-2 mb-4 d-flex justify-content-between">
              <Input
                style={{ width: 200 }}
                placeholder="Nhập từ khoá tìm kiếm"
                value={keyword}
                onChange={(e) => handleSearch(e.target.value)}
              />

              <Button type="primary" onClick={() => {}}>
                Phân quyền
              </Button>
            </div>
            <Table
              loading={getListLoading}
              columns={columns}
              dataSource={keyword.trim() ? searchList : list}
              pagination={{ defaultPageSize: 10 }}
            />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Thêm quyền" key="2">
          <Form
            form={form}
            className="form mx-auto mt-3"
            name="basic"
            onFinish={handleAdd}
            autoComplete="off"
            layout="vertical">
            <Form.Item
              label="Tên quyền"
              name="itemName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên quyền!",
                },
              ]}>
              <Input placeholder="Nhập tên quyền" />
            </Form.Item>

            <Button
              loading={addLoading}
              type="primary"
              htmlType="submit"
              className="submit-btn">
              Thêm
            </Button>
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
